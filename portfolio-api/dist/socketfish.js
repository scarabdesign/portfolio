"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketFish = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chess_js_1 = require("chess.js");
const crypto_1 = require("crypto");
const ChessRequestSub = 'chessRequest';
const ChessRequestRes = 'chessResponse';
const ChessMovesSub = 'chessMovesRequest';
const ChessMovesRes = 'chessMovesResponse';
const ChessSetBoardSub = 'chessSetBoardRequest';
const ChessSetBoardRes = 'chessSetBoardResponse';
const ChessUndoRequest = 'chessUndoRequest';
const ChessClearRequest = 'chessClearRequest';
const ChessListener = 'chessListener';
const ChessErrorRes = 'chessErrorResponse';
var connections = {};
var defaultDifficulty = 20;
const spawn = require('child_process').spawn;
function SendGameBoard(playerid) {
    try {
        let cc = connections[playerid];
        cc.socket.emit(ChessSetBoardRes, GetGameInfo(playerid));
    }
    catch (e) {
        console.log(e);
    }
}
function SetGameBoard(fen, playerid) {
    try {
        let cc = connections[playerid];
        cc.game.load(fen);
        SendGameBoard(playerid);
        cc.game.turn() == "b" && ParseGameMove(null, playerid);
    }
    catch (e) {
        console.log(e);
    }
}
function UndoMove(playerid) {
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
function ClearBoard(playerid) {
    try {
        let cc = connections[playerid];
        cc.game.reset();
        ParseGameMove(null, playerid);
    }
    catch (e) {
        console.log(e);
    }
}
function GetValidMoves(square, playerid) {
    try {
        let cc = connections[playerid];
        var piece = cc.game.get(square);
        var moves = cc.game.moves({ square });
        let squares = moves.map(m => { var _a; return (_a = m.replace("+", "").replace("#", "").replace(/=\w/, "").match(/..$/g)) === null || _a === void 0 ? void 0 : _a.at(0); });
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
    }
    catch (e) {
        console.log(e);
    }
}
function SendErrorResponse(playerid, error, board) {
    let cc = connections[playerid];
    cc && cc.socket.emit(ChessErrorRes, {
        playerid, error: error.toString(), board,
    });
}
async function ParseGameMove(request, playerid) {
    var _a;
    try {
        let cc = connections[playerid];
        if (cc) {
            if (request) {
                try {
                    cc.game.move(request);
                    SendGameBoard(playerid);
                }
                catch (err) {
                    return SendErrorResponse(playerid, err, cc.game.fen());
                }
            }
            if (cc.game.turn() == "b") {
                let bTurnFen = cc.game.fen();
                var bBestMove = await GetBestMove(playerid, bTurnFen, (defaultDifficulty + ((new Date().getTime() % 10) - 5)).toString());
                if (bBestMove) {
                    try {
                        cc.game.move(bBestMove);
                    }
                    catch (err) {
                        return SendErrorResponse(playerid, err, cc.game.fen());
                    }
                }
                else {
                    console.log("unable to find black best move");
                }
            }
            var wBestMove = (_a = await GetBestMove(playerid, cc.game.fen(), defaultDifficulty.toString())) !== null && _a !== void 0 ? _a : null;
            setTimeout(() => cc.socket.emit(ChessRequestRes, GetGameInfo(playerid, wBestMove, bBestMove)), 500);
        }
        else {
            console.log("game not found");
        }
    }
    catch (e) {
        console.log(e);
    }
}
function GetGameInfo(playerid, bestmove, blackmove) {
    try {
        let cc = connections[playerid];
        if (cc) {
            let nlSplit = "___";
            let pgn = cc.game.pgn({ maxWidth: 2, newline: nlSplit });
            let pgnhistory = pgn && pgn.replace(/\[.*\]/, "").split(nlSplit).filter(Boolean).reverse() || [];
            let reason = {
                tfold: cc.game.isThreefoldRepetition(),
                mate: cc.game.isCheckmate(),
                stale: cc.game.isStalemate(),
                pieces: cc.game.isInsufficientMaterial(),
                draw: cc.game.isDraw(),
            };
            let gameInfo = {
                playerid,
                bestmove,
                blackmove,
                pgnhistory,
                board: cc.game.fen(),
                check: cc.game.inCheck(),
                gameover: cc.game.isGameOver(),
                reason,
            };
            return gameInfo;
        }
    }
    catch (e) {
        console.log(e);
    }
}
async function GetBestMove(playerid, fen, depth) {
    var cons = connections;
    try {
        return await StockfishCommand({
            command: "bestmove", playerid, fen, depth,
            validate: function (result) {
                return result.toString().match(/(?<=bestmove )\w*/g);
            },
            parse: function (result) {
                let bestmove = result.toString().match(/(?<=bestmove )\w*/g);
                return (bestmove.length && bestmove[0]) || null;
            },
            listen: function (result) {
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
function StockfishCommand(params) {
    try {
        let cc = connections[params.playerid];
        if (cc) {
            return new Promise((resolve, reject) => {
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
    }
    catch (e) {
        console.log(e);
    }
}
function AddStockfishListeners(playerid, validate, listen, callback) {
    try {
        let cc = connections[playerid];
        if (cc) {
            function onError(data) {
                callback(data.toString());
            }
            ;
            function onData(data) {
                if (validate(data)) {
                    callback(null, data.toString());
                    removeStockfishListeners();
                }
                else {
                    listen(data.toString().replace(/\n/g, " - "));
                }
            }
            ;
            function removeStockfishListeners() {
                cc.stockfish.stderr.off('data', onError);
                cc.stockfish.stdout.off('data', onData);
            }
            ;
            cc.stockfish.stderr.on('data', onError);
            cc.stockfish.stdout.on('data', onData);
        }
    }
    catch (e) {
        console.log(e);
    }
}
function ServerConnect(socket) {
    let playerid = socket.handshake.headers.playerid.toString() || (0, crypto_1.randomUUID)();
    if (!connections[playerid]) {
        connections[playerid] = {
            socket,
            game: new chess_js_1.Chess(),
            stockfish: spawn(__dirname + '/../stockfish/stockfish-ubuntu-x86-64-avx2'),
        };
    }
    if (socket != connections[playerid].socket) {
        connections[playerid].socket.disconnect();
        connections[playerid].socket = socket;
    }
    socket.on('disconnect', (reason) => {
        console.log(reason, socket.handshake.headers.playerid.toString());
    });
    socket.on('error', (err) => {
        console.log(err);
    });
    ParseGameMove(null, playerid);
    console.log("Chess Connection: " + playerid);
}
function OnChessMovesRequest(request, socket) {
    try {
        let playerid = socket.handshake.headers.playerid.toString() || (0, crypto_1.randomUUID)();
        let id = request.playerid || playerid;
        let piece = request.param;
        GetValidMoves(piece, id);
    }
    catch (e) {
        console.log(e);
    }
}
function OnChessRequest(request, socket) {
    try {
        let playerid = socket.handshake.headers.playerid.toString() || (0, crypto_1.randomUUID)();
        let id = request.playerid || playerid;
        let move = request.param;
        ParseGameMove(move, id);
    }
    catch (e) {
        console.log(e);
    }
}
function OnChessUndoRequest(request, socket) {
    try {
        let playerid = socket.handshake.headers.playerid.toString() || (0, crypto_1.randomUUID)();
        UndoMove(playerid);
    }
    catch (e) {
        console.log(e);
    }
}
function OnChessClearRequest(request, socket) {
    try {
        let playerid = socket.handshake.headers.playerid.toString() || (0, crypto_1.randomUUID)();
        ClearBoard(playerid);
    }
    catch (e) {
        console.log(e);
    }
}
function OnChessSetBoardRequest(request, socket) {
    try {
        let playerid = socket.handshake.headers.playerid.toString() || (0, crypto_1.randomUUID)();
        let id = request.playerid || playerid;
        let fen = request.param;
        SetGameBoard(fen, id);
    }
    catch (e) {
        console.log(e);
    }
}
let SocketFish = exports.SocketFish = class SocketFish {
    onModuleInit() {
        this.server.on('connection', ServerConnect);
    }
    onChessMovesRequest(request, socket) {
        OnChessMovesRequest(request, socket);
    }
    onChessRequest(request, socket) {
        OnChessRequest(request, socket);
    }
    onChessUndoRequest(request, socket) {
        OnChessUndoRequest(request, socket);
    }
    onChessClearRequest(request, socket) {
        OnChessClearRequest(request, socket);
    }
    onChessSetBoardRequest(request, socket) {
        OnChessSetBoardRequest(request, socket);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketFish.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(ChessMovesSub),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketFish.prototype, "onChessMovesRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ChessRequestSub),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketFish.prototype, "onChessRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ChessUndoRequest),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketFish.prototype, "onChessUndoRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ChessClearRequest),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketFish.prototype, "onChessClearRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(ChessSetBoardSub),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketFish.prototype, "onChessSetBoardRequest", null);
exports.SocketFish = SocketFish = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], SocketFish);
//# sourceMappingURL=socketfish.js.map