/***
TODO:

- Remove old game entries 
  - on disconnect?
  - after time period?
- Make difficulty adjustable 
- Make 2 player game
- use common types
- better error handling
- research ponder

***/

import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { Chess } from 'chess.js'
import { randomUUID } from "crypto";

const ChessRequestSub = 'chessRequest'
const ChessRequestRes = 'chessResponse'
const ChessMovesSub = 'chessMovesRequest'
const ChessMovesRes = 'chessMovesResponse'
const ChessSetBoardSub = 'chessSetBoardRequest'
const ChessSetBoardRes = 'chessSetBoardResponse'
const ChessUndoRequest = 'chessUndoRequest'
const ChessClearRequest = 'chessClearRequest'
const ChessListener = 'chessListener'
const ChessErrorRes = 'chessErrorResponse'

var connections = {};
var defaultDifficulty = 20;

const spawn = require('child_process').spawn

type ChessRequest = {
  playerid?: string,
  param?: string
}

type StockfishRequest = {
  playerid: string,
  command: string,
  fen?: string,
  depth?: string,
  validate?: Function,
  listen?: Function,
  parse?: Function,
}

type ChessConnection = {
  socket: Socket,
  game: Chess,
  stockfish: any,
}

type GameOverReasons = {
  mate: boolean, 
  stale: boolean, 
  pieces: boolean, 
  draw: boolean,
  tfold: boolean,
}

type GameInfo = {
  playerid: string,
  bestmove?: string, 
  blackmove?: string, 
  pgnhistory?: string[],
  board?: string, 
  check?: boolean,
  gameover?: boolean,
  reason?: GameOverReasons
}

function SendGameBoard (playerid: string) {
  try {
    let cc = connections[playerid];
    cc.socket.emit(ChessSetBoardRes, GetGameInfo(playerid));
  }
  catch (e) {
    console.log(e);
  }
}

function SetGameBoard (fen: string, playerid: string) {
  try {
    let cc = connections[playerid];
    cc.game.load(fen);
    SendGameBoard(playerid)
    cc.game.turn() == "b" && ParseGameMove(null, playerid);
  }
  catch (e) {
    console.log(e);
  }
}

function UndoMove (playerid: string) {
  try {
    let cc = connections[playerid];
    cc.game.undo();
    cc.game.undo();
    ParseGameMove(null, playerid);
  }
  catch (e) {
    console.log(e);
  }
}

function ClearBoard (playerid: string) {
  try {
    let cc = connections[playerid];
    cc.game.reset();
    ParseGameMove(null, playerid);
  }
  catch (e) {
    console.log(e);
  }
}

function GetValidMoves (square: string, playerid: string) {
  try {
    let cc = connections[playerid];
    var piece = cc.game.get(square);
    var moves = cc.game.moves({ square });
    let squares = moves.map(m => m.replace("+", "").replace("#", "").replace(/=\w/, "").match(/..$/g)?.at(0));
    var danger = {};
    squares.forEach(m => {
      danger[m] = cc.game.isAttacked(m, "b");
    });
    cc.socket.emit(ChessMovesRes, {
      playerid, moves, square, danger,
      piece: piece && (piece.color == "w") ? piece.type.toUpperCase() : piece.type,
      safecastle: {
        Q: !cc.game.inCheck() &&
          !cc.game.isAttacked("b1", "b") && !cc.game.isAttacked("c1", "b") && !cc.game.isAttacked("d1", "b") &&
          !cc.game.get("b1") && !cc.game.get("c1") && !cc.game.get("d1"),
        K: !cc.game.inCheck() &&
          !cc.game.isAttacked("f1", "b") && !cc.game.isAttacked("g1", "b") &&
          !cc.game.get("f1") && !cc.game.get("g1"),
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function SendErrorResponse (playerid: string, error: string, board: string) {
  let cc = connections[playerid];
  cc && cc.socket.emit(ChessErrorRes, {
    playerid, error: error.toString(), board,
  });
}

async function ParseGameMove (request: string, playerid: string) {
  try {
    let cc = connections[playerid];
    if (cc) {

      // currently white's incoming turn
      if (request) {
        try {
          // make incoming white move on board
          cc.game.move(request);

          // send updated board;
          SendGameBoard(playerid);
        }
        catch (err) {
          return SendErrorResponse(playerid, err, cc.game.fen());
        }
      }

      // now black's turn. 
      if (cc.game.turn() == "b") {

        //get fen for black
        let bTurnFen = cc.game.fen();

        // get next move for black
        var bBestMove = await GetBestMove(
          playerid, bTurnFen, (defaultDifficulty + ((new Date().getTime() % 10) - 5)).toString()
        );

        if (bBestMove) {
          try {
            // make black move on board
            cc.game.move(bBestMove);
          }
          catch (err) {
            return SendErrorResponse(playerid, err, cc.game.fen());
          }

        } else {
          //TODO: should it fail, not sure what to do
          console.log("unable to find black best move");
        }
      }

      // white's turn again
      var wBestMove = await GetBestMove(playerid, cc.game.fen(), defaultDifficulty.toString()) ?? null;

      // respond => send ids, board, white bestmove. animate black move on front
      setTimeout(() =>
        cc.socket.emit(ChessRequestRes, GetGameInfo(playerid, wBestMove, bBestMove)), 500
      );

    } else {
      //TODO: return feedback
      console.log("game not found");
    }
  } catch (e) {
    console.log(e);
  }
}

function GetGameInfo(playerid: string, bestmove ?: string, blackmove ?: string) {
  try {
    let cc = connections[playerid];
    if (cc) {
      let nlSplit = "___";
      let pgn = cc.game.pgn({ maxWidth: 2, newline: nlSplit});
      let pgnhistory = pgn && pgn.replace(/\[.*\]/, "").split(nlSplit).filter(Boolean).reverse() || [];
      let reason: GameOverReasons = {
        tfold: cc.game.isThreefoldRepetition(),
        mate: cc.game.isCheckmate(),
        stale: cc.game.isStalemate(),
        pieces: cc.game.isInsufficientMaterial(),
        draw: cc.game.isDraw(),
      }
      let gameInfo: GameInfo = {
        playerid,
        bestmove,
        blackmove,
        pgnhistory,
        board: cc.game.fen(),
        check: cc.game.inCheck(),
        gameover: cc.game.isGameOver(),
        reason,
      }
      return gameInfo;
    }
  } catch (e) {
    console.log(e);
  }
}

async function GetBestMove(playerid: string, fen: string, depth: string) {
  var cons = connections;
  try {
    return await StockfishCommand({
      command: "bestmove", playerid, fen, depth,
      validate: function (result: string) {
        return result.toString().match(/(?<=bestmove )\w*/g);
      },
      parse: function (result: string) {
        let bestmove = result.toString().match(/(?<=bestmove )\w*/g);
        return (bestmove.length && bestmove[0]) || null;
      },
      listen: function (result: string) {
        let cc = cons[playerid];
        cc.socket && cc.socket.emit(ChessListener, {
          playerid,
          whisper: result,
        });
      }
    });
  }
  catch (e) {
    console.log(e);
  }
}

function StockfishCommand(params: StockfishRequest) {
  try {
    let cc = connections[params.playerid];
    if (cc) {
      return new Promise<string>((resolve, reject) => {
        if (params.fen) {
          let comStr = "position fen " + params.fen;
          cc.stockfish.stdin.write(comStr + "\n");
        }

        AddStockfishListeners(params.playerid, params.validate, params.listen, (error, result) => {
          if (error)
            return reject(error);
          resolve(params.parse(result));
        });

        switch (params.command) {
          case "bestmove":
            cc.stockfish.stdin.write("go depth " + params.depth + "\n");
            break;
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function AddStockfishListeners(playerid: string, validate: Function, listen: Function, callback: Function) {
  try {
    let cc = connections[playerid];
    if (cc) {
      function onError(data: string) {
        callback(data.toString());
      };

      function onData(data: string) {
        if (validate(data)) {
          callback(null, data.toString())
          removeStockfishListeners();
        } else {
          listen(data.toString().replace(/\n/g, " - "));
        }
      };

      function removeStockfishListeners() {
        cc.stockfish.stderr.off('data', onError);
        cc.stockfish.stdout.off('data', onData);
      };

      cc.stockfish.stderr.on('data', onError);
      cc.stockfish.stdout.on('data', onData);
    }
  } catch (e) {
    console.log(e);
  }

}

function ServerConnect(socket: Socket){
  let playerid = socket.handshake.headers.playerid.toString() || randomUUID();
  if (!connections[playerid]) {

    //TODO: to add here:
    // player info
    // difficulty

    connections[playerid] = {
      socket,
      game: new Chess(),
      stockfish: spawn(__dirname + '/../stockfish/stockfish-ubuntu-x86-64-avx2'),
    };
  }

  if (socket != connections[playerid].socket) {
    connections[playerid].socket.disconnect();
    connections[playerid].socket = socket;
  }

  socket.on('disconnect', (reason) => {
    //TODO: remove connections entry? or keep for reconnecting
    console.log(reason, socket.handshake.headers.playerid.toString());
  });

  socket.on('error', (err) => {
    console.log(err);
  });

  ParseGameMove(null, playerid);

  console.log("Chess Connection: " + playerid);
}


function OnChessMovesRequest(request: ChessRequest, socket: Socket) {
  try {
    let playerid = socket.handshake.headers.playerid.toString() || randomUUID();
    let id = request.playerid || playerid;
    let piece = request.param;
    GetValidMoves(piece, id);
  }
  catch (e) {
    console.log(e);
  }
}

function OnChessRequest(request: ChessRequest, socket: Socket) {
  try {
    let playerid = socket.handshake.headers.playerid.toString() || randomUUID();
    let id = request.playerid || playerid;
    let move = request.param;
    ParseGameMove(move, id);
  }
  catch (e) {
    console.log(e);
  }
}

function OnChessUndoRequest(request: ChessRequest, socket: Socket) {
  try {
    let playerid = socket.handshake.headers.playerid.toString() || randomUUID();
    UndoMove(playerid);
  }
  catch (e) {
    console.log(e);
  }
}

function OnChessClearRequest(request: ChessRequest, socket: Socket) {
  try {
    let playerid = socket.handshake.headers.playerid.toString() || randomUUID();
    ClearBoard(playerid);
  }
  catch (e) {
    console.log(e);
  }
}

function OnChessSetBoardRequest(request: ChessRequest, socket: Socket) {
  try {
    let playerid = socket.handshake.headers.playerid.toString() || randomUUID();
    let id = request.playerid || playerid;
    let fen = request.param;
    SetGameBoard(fen, id);
  }
  catch (e) {
    console.log(e);
  }
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketFish implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  
  onModuleInit() {
    this.server.on('connection', ServerConnect);
  }

  @SubscribeMessage(ChessMovesSub)
  onChessMovesRequest(@MessageBody() request: ChessRequest, @ConnectedSocket() socket: Socket) {
    OnChessMovesRequest(request, socket);
  }

  @SubscribeMessage(ChessRequestSub)
  onChessRequest(@MessageBody() request: ChessRequest, @ConnectedSocket() socket: Socket) {
    OnChessRequest(request, socket);
  }

  @SubscribeMessage(ChessUndoRequest)
  onChessUndoRequest(@MessageBody() request: ChessRequest, @ConnectedSocket() socket: Socket) {
    OnChessUndoRequest(request, socket);
  }

  @SubscribeMessage(ChessClearRequest)
  onChessClearRequest(@MessageBody() request: ChessRequest, @ConnectedSocket() socket: Socket) {
    OnChessClearRequest(request, socket);
  }

  @SubscribeMessage(ChessSetBoardSub)
  onChessSetBoardRequest(@MessageBody() request: ChessRequest, @ConnectedSocket() socket: Socket) {
    OnChessSetBoardRequest(request, socket);
  }
}
