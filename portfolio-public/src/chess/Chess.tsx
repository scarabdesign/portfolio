
import { io } from "socket.io-client";
import './Chess.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toast, { Toaster } from 'react-hot-toast';
import uuid from 'react-uuid';
import { SyntheticEvent, useState } from 'react';
import ReactDOMServer from "react-dom/server";
// @ts-ignore 
import arrowLine from 'arrow-line'


/***
TODO:

- fix saving board to localStorage

- make controls to on/off highlights
- use CSS pre-processing
- use config files
- consolidate dimensions
- make back navigation undo moves
- animate undo/reset
- seperate out each side's moves


***/
const playerid = localStorage.playerid ?? localStorage.setItem("playerid", uuid()) ?? localStorage.playerid;
const initialBoard = localStorage.board ?? localStorage.setItem("board", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") ?? localStorage.board;
const socket = io("ws://38.77.241.58:3000", {
    extraHeaders: { playerid }
});

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

var turn: string;
var castles: string;
var enpass: string;
var deadPieces: string;
var alivePieces: string;
var bestmove: string;
var inCheck: boolean;
var isGameOver: boolean;
var isMate: boolean;
var isStale: boolean;
var nePieces: boolean;
var isDraw: boolean;
var tfold: boolean;
var halves: string;
var moveCount: string;
var currentBoard = initialBoard;
var pgnHistory: string[];
var autoMoveEnabled = false;
var whisperQueue: any = [];

type SquareProps = {
    color: string,
    row: string,
    column: string,
    piece?: string,
}

type GameOverReasons = {
    mate: boolean, 
    stale: boolean, 
    pieces: boolean, 
    draw: boolean,
    tfold: boolean,
}

type ChessResponse = {
    playerid: string,
    bestmove?: string, 
    blackmove?: string,
    pgnhistory?: string[], 
    board?: string, 
    check?: boolean,
    gameover?: boolean,
    reason?: GameOverReasons
    error?: string,
}

type HighlightRequest = {
    playerid: string, 
    moves: string[], 
    piece: string, 
    square: string, 
    danger: {
        [key: string]: boolean
    },
    safecastle: { Q: boolean, K: boolean }
}

const PieceIcons: any = {
    p: "fa-solid fa-chess-pawn",
    r: "fa-solid fa-chess-rook",
    n: "fa-solid fa-chess-knight",
    b: "fa-solid fa-chess-bishop",
    q: "fa-solid fa-chess-queen",
    k: "fa-solid fa-chess-king",
}

const InterfaceIcons: any = {    
    whitespinner: "fa-solid fa-circle-notch fa-spin turnspinner white",
    blackspinner: "fa-solid fa-circle-notch fa-spin turnspinner black",
    whitebrain: "fa-solid fa-brain white",
    blackbrain: "fa-solid fa-brain black",
    bulboff: "fa-solid fa-lightbulb",
    bulbon: "fa-regular fa-lightbulb",
    chess: "fa-solid fa-chess",
    check: "fa-solid fa-check",
    undo: "fa-solid fa-undo",
    play: "fa-solid fa-play",
    x: "fa-solid fa-xmark",
}

const DefaultArrowThichness = 3;
const DefaultArrowColor = "yellow";
const DefaultSqareDim = 100;
const DefaultBorderWidth = 2;
const DefaultPieceDim = 80;
const DefaultDeadPieceDim = DefaultPieceDim/2;
const DefaultPieceGutter = (DefaultSqareDim - DefaultPieceDim)/2;
const BoardDim = 8;

const Discard = () => turn == "b" ? "whitediscard" : "blackdiscard";
function BestArrow(fX: number, fY: number, tX: number, tY: number){
    var arrow = arrowLine(
        { x: fX, y: fY },
        { x: tX, y: tY },
        {
            color: DefaultArrowColor,
            thickness: DefaultArrowThichness,
            curvature: 0,
        }
    );
    $(".board").prepend(
        $("#" + arrow.getParentSvgId())
            .addClass("bestmoveArrow hide")
            .attr({
                height: (DefaultSqareDim + DefaultBorderWidth) * BoardDim,
                width: (DefaultSqareDim + DefaultBorderWidth) * BoardDim,
            })
            .removeAttr("style")
            .css({
                zIndex: 1,
                position: "absolute",
                pointerEvents: "none"
            })
    );
    return arrow;
}

function HistoryBoard({ historyArray }: { historyArray: string[] }){
    return (
        <div className="chesshistory" >
            {
                historyArray && historyArray
                    .map(h => {
                        let parts = h.split(" ");
                        let turnNumber = parts[0];
                        let tnInt = parseInt(turnNumber, 10);
                        let wMove = parts[1];
                        let bMove = parts[2];
                        let kCastle = "O-O";
                        let qCastle = "O-O-O";
                        var wParts, wPiece, wAttack, wCastle, wSquare, wCheck, wMate, wPromote;
                        var bParts, bPiece, bAttack, bCastle, bSquare, bCheck, bMate, bPromote;
                        if(wMove){
                            bCheck = wMove.search(/\+$/) > -1 ? <i className="tinypiece check black" /> : null;
                            bMate = wMove.search(/\#$/) > -1 ? <i className="tinypiece check mate black" /> : null;
                            wPromote = wMove.search(/\=/) > -1 ? <i className={`tinypiece promote ${ wMove.match(/(?<=\=)\w/)?.at(0)?.toLowerCase() } white`} /> : null;
                            if(wMove.search(kCastle) > -1 || wMove.search(qCastle) > -1){
                                wCastle = <i className={`tinypiece white ${wMove == kCastle ? "kingcastle" : "queencastle"}`} />;
                                wPiece = wMove == kCastle ? "k" : "r";
                                !!bCheck && wMove.replace("+", "");
                                !!bMate && wMove.replace("#", "");
                            } else {
                                !!wPromote && (wMove = wMove.replace(/\=\w/, ""));
                                wParts = wMove.split("");
                                wPiece = wParts[0] == wParts[0].toUpperCase() ? wParts.shift()?.toLowerCase() : "p";
                                let atInd = wParts.indexOf("x");
                                wAttack = atInd > -1 && wParts.splice(atInd, 1)?.length ? <i className="tinypiece attack" /> : null;
                                !!bCheck && wParts.splice(-1, 1);
                                !!bMate && wParts.splice(-1, 1);
                                if(!!wAttack && wParts.length == 3){
                                    wParts.splice(0, 1);
                                }
                                let wC = wParts[0].charCodeAt(0) - 97;
                                let wR = parseInt(wParts[1], 10);
                                wSquare = <span className={`hsquare ${ (wC%2+wR%2)%2 == 1 ? "black" : "white" }`} >{wParts?.join("")}</span> ;
                            }
                        }
                        if(bMove){
                            wCheck = bMove.search(/\+$/) > -1 ? <i className="tinypiece check white" /> : null;
                            wMate = bMove.search(/\#$/) > -1 ? <i className="tinypiece check mate white" /> : null;
                            bPromote = bMove.search(/\=/) > -1 ? <i className={`tinypiece promote ${ bMove.match(/(?<=\=)\w/)?.at(0)?.toLowerCase() } black`} /> : null;
                            if(bMove == kCastle || bMove == qCastle){
                                bCastle = <i className={`tinypiece black ${bMove == kCastle ? "kingcastle" : "queencastle"}`} />;
                                bPiece = bMove == kCastle ? "k" : "r";
                                !!wCheck && bMove.replace("+", "");
                                !!wMate && bMove.replace("#", "");
                            } else {
                                !!bPromote && (bMove = bMove.replace(/\=\w/, ""));
                                bParts = bMove.split("");
                                bPiece = bParts[0] == bParts[0].toUpperCase() ? bParts.shift()?.toLowerCase() : "p";
                                let atInd = bParts.indexOf("x");
                                bAttack = atInd > -1 && bParts.splice(atInd, 1)?.length ? <i className="tinypiece attack" /> : null;
                                !!wCheck && bParts.splice(-1, 1);
                                !!wMate && bParts.splice(-1, 1);
                                if(!!bAttack && bParts.length == 3){
                                    bParts.splice(0, 1);
                                }
                                let bC = bParts[0].charCodeAt(0) - 97;
                                let bR = parseInt(bParts[1], 10);
                                bSquare = <span className={`hsquare ${ (bC%2+bR%2)%2 == 1 ? "black" : "white" }`} >{bParts?.join("")}</span> ;
                            }                            
                        }

                        return <div key={tnInt}>
                            {turnNumber}
                            <i className={`tinypiece white ${wPiece}`} />{wAttack}{wCastle}{wSquare}{wPromote}{bCheck}{bMate}
                            <i className={`tinypiece black ${bPiece}`} />{bAttack}{bCastle}{bSquare}{wPromote}{wCheck}{wMate}
                        </div>
                    })
            }
        </div>
    );
}

function PieceIcon({ piece }: { piece: string }) {
    var lowerType = piece.toLowerCase();
    var icon = PieceIcons[lowerType];
    if (icon) {
        return <FontAwesomeIcon className="pieceIcon" icon={icon} fixedWidth />
    }
}

var key = 0;
function Piece(piece: string, dead: boolean = false) {
    ++key;
    let pieceAttr = { 'data-piece': piece };
    let pieceColor = piece == piece?.toLowerCase() ? "black" : "white";

    let _draw = (isStale || nePieces || isDraw) && (piece == "k" || piece == "K") ? "check mate" : "";
    let _check = inCheck && ((piece == "k" && turn.toLowerCase() == "b") || (piece == "K" && turn.toLowerCase() == "w")) ? "check" : "";
    let _mate = isMate && ((piece == "k" && turn.toLowerCase() == "b") || (piece == "K" && turn.toLowerCase() == "w")) ? "mate" : "";
    
    return (
        <div key={`${key}`} className={`${(dead ? "deadpiece" : "piece")} ${pieceColor} ${_check} ${_mate} ${_draw}`} {...pieceAttr} >
            <PieceIcon piece={`${piece}`} />
        </div>
    )
}

function Square({ color, piece, row, column }: SquareProps) {
    let rowAttr = { 'data-row': row };
    let columnAttr = { 'data-column': column };
    return (
        <div className={`square ${color}`} {...rowAttr} {...columnAttr} >
            {piece && Piece(piece)}
        </div>
    );
}

function Row({ odd, row, positions }: { odd: boolean, row: string, positions?: Array<string> }) {
    return (
        <div className="boardrow" >
            <Square color={odd ? 'black' : 'white'} piece={positions?.at(0)} column='a' row={row} />
            <Square color={odd ? 'white' : 'black'} piece={positions?.at(1)} column='b' row={row} />
            <Square color={odd ? 'black' : 'white'} piece={positions?.at(2)} column='c' row={row} />
            <Square color={odd ? 'white' : 'black'} piece={positions?.at(3)} column='d' row={row} />
            <Square color={odd ? 'black' : 'white'} piece={positions?.at(4)} column='e' row={row} />
            <Square color={odd ? 'white' : 'black'} piece={positions?.at(5)} column='f' row={row} />
            <Square color={odd ? 'black' : 'white'} piece={positions?.at(6)} column='g' row={row} />
            <Square color={odd ? 'white' : 'black'} piece={positions?.at(7)} column='h' row={row} />
        </div>
    );
}

function Board({ positions }: { positions?: Array<Array<string>> }) {
    return (
        <div className="board">
            <Row positions={positions?.at(0)} odd={false} row="8" />
            <Row positions={positions?.at(1)} odd={true} row="7" />
            <Row positions={positions?.at(2)} odd={false} row="6" />
            <Row positions={positions?.at(3)} odd={true} row="5" />
            <Row positions={positions?.at(4)} odd={false} row="4" />
            <Row positions={positions?.at(5)} odd={true} row="3" />
            <Row positions={positions?.at(6)} odd={false} row="2" />
            <Row positions={positions?.at(7)} odd={true} row="1" />
        </div>
    );
}

function PromotionPreview() {
    let qAttr = { 'data-piece': "Q" };
    let rAttr = { 'data-piece': "R" };
    let bAttr = { 'data-piece': "B" };
    let nAttr = { 'data-piece': "N" };
    return (
        <div className="piecePreview white">
            <div {...qAttr}><PieceIcon piece={"Q"} /></div>
            <div {...rAttr}><PieceIcon piece={"R"} /></div>
            <div {...bAttr}><PieceIcon piece={"B"} /></div>
            <div {...nAttr}><PieceIcon piece={"N"} /></div>
        </div>
    );
}

var aboutShown = true;
var aboutSeen = false;
var aboutPanel = <div className="aboutPanel" >
    <div>
        <div className="innerAboutPanel">
            <div className="infocloser fa-solid fa-circle-xmark" ></div>
            <h3>Simple Chess!</h3>
            <p>This app was developed in ~4 days in React 18 with Vite and a NestJS API. 
            A WebSocket is used for all requests. The chess AI is a Stockfish binary 
            and the game rules are tracked with chess.js. The icons are all from 
            Font Awesome (Free).</p>
        </div>
    </div>
</div>;

function AboutInit(){
    if(!aboutSeen){
        aboutSeen = true;
        About();
    }
}

function About(){
    aboutShown = !aboutShown;
    $(".chessMessageContainer")
        .empty()
        .append(
            aboutShown ? "" : ReactDOMServer.renderToString(aboutPanel)
        );
    if(!aboutShown){
        $(".chessMessageContainer .infocloser")
            .on("click", About);
    } else {
        $(".chessMessageContainer .infocloser")
            .off("click", About);
    }
}

function TurnHeader(){
    return (
        <div className="turninfo">
            <span className="turncounter">
                <span title="Halfmove Count">{halves}</span>
                /
                <span title="Fullmove Count">{moveCount}</span>
            </span>
            <span className="infobutton fa-solid fa-question" onClick={About}></span>
            <span className="turnindicator" >
                <span className="fa-layers fa-fw fa-lg spinnercontainer white hide">
                    <FontAwesomeIcon icon={InterfaceIcons.whitebrain} fixedWidth transform="shrink-5" />
                    <i className={InterfaceIcons.whitespinner} ></i>
                </span>
                <span className="fa-layers fa-fw fa-lg spinnercontainer black hide">
                    <FontAwesomeIcon icon={InterfaceIcons.blackbrain} fixedWidth transform="shrink-5" />
                    <i className={InterfaceIcons.blackspinner} ></i>
                </span>
            </span>
        </div>
    );
}

function ButtonHeader() {
    return (
        <div className="chessbuttons">
            {/*<button onClick={Tester} className="testbutton">Test</button>*/}
            <button onClick={ToggleAutoPlay} className="autoPlay" title="Auto Play">
                <span className="fa-layers fa-fw fa-lg">
                    <FontAwesomeIcon icon={InterfaceIcons.play} fixedWidth />
                    <span className={`autoPlayOff ${autoMoveEnabled ? "hide" : ""}`} >
                        <FontAwesomeIcon icon={InterfaceIcons.x} transform="shrink-4" color="black" />
                        <FontAwesomeIcon icon={InterfaceIcons.x} transform="shrink-6" color="gray" />
                    </span>
                    <span className={`autoPlayOn ${autoMoveEnabled ? "" : "hide" }`} >
                        <FontAwesomeIcon icon={InterfaceIcons.check} transform="shrink-4" color="black" />
                        <FontAwesomeIcon icon={InterfaceIcons.check} transform="shrink-6" color="green" />
                    </span>
                </span>
            </button>
            <button onClick={ToggleBestMove} className="showBestButton" title="Show Suggestion">
                <FontAwesomeIcon icon={InterfaceIcons.bulbon} fixedWidth className="showBestIconOn hide" />
                <FontAwesomeIcon icon={InterfaceIcons.bulboff} fixedWidth className="showBestIconOff" />
            </button>
            <button onClick={ResetGame} className="chessreset" title="Restart Game">
                <FontAwesomeIcon icon={InterfaceIcons.chess} fixedWidth />
            </button>
            <button onClick={UndoMove} className="undoMove" title="Undo Move">
                <FontAwesomeIcon icon={InterfaceIcons.undo} fixedWidth />
            </button>
        </div>
    );
}

function ChessBody(){
    return (
        <div className="chessbody">
            <Toaster 
                containerClassName="chessMessageContainer"
                position="bottom-center" 
                reverseOrder={false}
            />
            <div className="chessheader">
                <ButtonHeader />
                <TurnHeader />
            </div>
            <HistoryBoard historyArray={pgnHistory} />
            <Board positions={ParseFen(currentBoard)} />
            <DeadBoard color="black" />
            <DeadBoard color="white" />
            <div className="chessfooter">
                <div className="whisperpanel" title="Stockfish Musings" />
            </div>
        </div>
    );
}

function ShowHideSpinner(onOff: boolean, color?: string){
    var _color = (color && (color == "w" ? ".white" : ".black")) || "";
    $(".spinnercontainer" + _color)
        .removeClass(onOff ? "hide" : "")
        .addClass(!onOff ? "hide" : "")
}

function ClearBoardStyles() {
    overSquare = "";
    $(".square")
        .removeClass("nomoves highlight danger")
        .droppable({ disabled: true });
}

var overSquare = "";
var isDragging = false;
function SetUpDrag() {

    $(".piece")
        .draggable({
            revert: "invalid",
            grid: [(DefaultSqareDim + DefaultBorderWidth), (DefaultSqareDim + DefaultBorderWidth)],
            drag: function () {
                isDragging = true;
            },
            stop: function () {
                isDragging = false;
            }
        });

    var isClick = false;
    $(".board")
        .off("mouseleave")
        .on("mouseleave", () => {
            !isClick && ClearBoardStyles();
        });

    $(".square")
        .off("mouseup").off("mouseover").off("mouseleave")
        .on("mouseup mouseover", function (e) {
            if (isDragging) return;
            if (!$(this).find(".piece.white").length) {
                return;
            }
            isClick = e.type == "mouseup";
            var row = $(this).attr("data-row") || "";
            var column = $(this).attr("data-column") || "";
            if (row && column) {
                let os = column + row;
                if (os == overSquare) {
                    return;
                }
                !isClick && ClearBoardStyles();
                overSquare = os;
                GetMoves(overSquare);
            }
        })
        .on("mouseleave", (e) => {
            if (isDragging) return;
            !isClick && ClearBoardStyles();
        })
        .droppable({
            drop: function (event, ui) {
                ParseDrop(ui.draggable, event.target);
            }
        });
}

function DestroyArrow(){
    try{
        bestArrow && bestArrow.remove() && (bestArrow == null);
        $(".bestmoveArrow").find("path").remove();
    } catch {}
}

function LockBoard(){
    ClearBoardStyles();
    DisableMouseOver();
    DisableDrag();
    DestroyArrow();
    ShowBestMove(false);
}

function ParseDrop(draggable: JQuery<Element>, eventtarget: Element) {
    LockBoard();
    $(".whisperpanel").empty();
    var piece = $(draggable).attr("data-piece") || "";
    var fromSquare = $(draggable).closest(".square");
    var fromRow = $(fromSquare).attr("data-row") || "";
    var fromColumn = $(fromSquare).attr("data-column") || "";
    var toRow = $(eventtarget).attr("data-row") || "";
    var toColumn = $(eventtarget).attr("data-column") || "";
    if (toRow && fromRow && fromColumn && toColumn && piece) {
        let fromSq = fromColumn + fromRow;
        let toSq = toColumn + toRow;
        let move = piece + fromSq + "-" + toSq;
        ProcessWhiteMove(draggable, move, piece, toSq);
    }
}

function AnimateEnPassant(piece: string, toSq: string, callback: Function){
    if (piece && piece != "p" && piece != "P") return false;
    if (toSq && enpass == toSq) {
        var row = toSq.replace("+", "").replace("#", "").match(/\d$/g)?.at(0);
        if(row && row === "6"){
            var tSq = toSq.replace(row, (parseInt(row, 10) - 1).toString());
            AnimateDead(tSq, Discard(), callback);
            return true;
        }
        if(row && row === "3"){
            var tSq = toSq.replace(row, (parseInt(row, 10) + 1).toString());
            AnimateDead(tSq, Discard(), callback);
            return true;
        }
    }
    return false;
}

function AnimateCastles(move: string, callback: Function){
    switch(move){
        case "Ke1-c1":
            castles.search("Q") > -1 && AnimateCastle("a1", "d1", callback);
            return true;
        case "Ke1-g1":
            castles.search("K") > -1 && AnimateCastle("h1", "f1", callback);
            return true;
        case "ke8-c8":
            castles.search("q") > -1 && AnimateCastle("a8", "d8", callback);
            return true;
        case "ke8-g8":
            castles.search("k") > -1 && AnimateCastle("h8", "f8", callback);
            return true;
    }
    return false;
}

function AnimateCastle(from: string, to: string, callback: Function){
    var pieceObj = GetPieceAtSquare(from);
    return pieceObj && $(pieceObj).animate(GetPoitionOfSquare(to), 1000, "swing", () => callback());
}

function ProcessWhiteMove(attacking: JQuery<Element>, move: string, piece: string, toSquare: string, ){
    var _finally = () => {
        MakeMove(move);
    };

    //animate castles
    if(AnimateCastles(move, _finally)) return;

    //Pawn promotion
    if (parseInt(toSquare[1], 10) === 8 && piece == "P") {
        $("svg", attacking).replaceWith($(ReactDOMServer.renderToString(PromotionPreview())));
        $(attacking)
            .removeClass("piece")
            .addClass("piecePreviewContainer")
            .find(".piecePreview > div")
            .on("click", function(){
                move += GetSymbol($(this));
                _finally();
            });
        AnimateDead(toSquare, Discard());
        return;
    }

    //En passant animation
    if(AnimateEnPassant(piece, toSquare, _finally)) return;

    //Final death throws
    return AnimateDead(toSquare, Discard(), () => {
        _finally();
    });
}

function AnimateDead(toSq: string, targetDiscard: string, callback?: Function) {
    var tDis = "." + targetDiscard;
    var targetdiscardOffset = $(tDis).offset();
    var targetdiscardTop = targetdiscardOffset?.top ?? 0;
    var targetdiscardLeft = targetdiscardOffset?.left ?? 0;
    var targetPiece = GetPieceAtSquare(toSq);
    var targetSquare = GetSquareAt(toSq);
    var deadcount = $(tDis + " > div").length;
    if (targetSquare && targetSquare.length && targetPiece && targetPiece.length) {
        var deadStart = {
            "position": "absolute",
            "top": (targetSquare.offset()?.top ?? 0) + DefaultPieceGutter,
            "left": (targetSquare.offset()?.left ?? 0) + DefaultPieceGutter,
            "width": DefaultPieceDim,
            "height": DefaultPieceDim,
        }
        var deadEnd = {
            "top": (targetdiscardTop + DefaultPieceGutter) + (DefaultDeadPieceDim * (deadcount + 1)),
            "left": (targetdiscardLeft + DefaultPieceGutter),
            "width": DefaultDeadPieceDim,
            "height": DefaultDeadPieceDim,
        }
        var targetSymb = targetPiece && (GetSymbol(targetPiece) || "");
        var deadPiece = $(ReactDOMServer.renderToString(Piece(targetSymb, true))).css(deadStart);
        if (deadPiece) {
            var animationComplete = () => {
                $(deadPiece).remove();
                callback && callback();
            };

            $(tDis).append(deadPiece);
            targetPiece && $(targetPiece).addClass("hide");
            return $(deadPiece).animate(deadEnd, 1000, "swing", animationComplete);
        }
    }

    callback && callback();
}

function QueueWhisper(whisper: string, color?: string){
    whisperQueue.push({
        whisper, color
    });
    RunWhisperQueue();
}

var whispersRunning = false;
function RunWhisperQueue(){
    if(whispersRunning) return;
    whispersRunning = true;
    var _loop = () => {
        var whisperObj = whisperQueue.shift();
        if(whisperObj == null){
            whispersRunning = false;
            return;
        }
        var wLen = $(".whisperpanel")?.get(0)?.innerText.length ?? 0;
        wLen >= 2000 && ClearWhisperPanel();
        WhisperMessage(whisperObj.whisper, whisperObj.color);
        setTimeout(_loop, 100);
    };
    _loop();
}

function ClearWhisperPanel(){
    $(".whisperpanel").empty();
}

function WhisperMessage(whisper: string, color: string = "black"){
    var panel = $(".whisperpanel").get(0);
    panel && $(panel)
        .append(
            color != "black" ?
            $("<span>")
                .css({ color })
                .append(whisper) :
            whisper
        );
    panel && (panel.scrollTop = panel.scrollHeight);
}

function HighlightSquares({ moves, piece, square, safecastle, danger }: HighlightRequest) {
    let squares = moves.map(m => m.replace("+", "").replace("#", "").replace(/=\w/, "").match(/..$/g)?.at(0));
    if (!squares.length) {
        var sqObj = GetSquareAt(square);
        sqObj && $(sqObj).addClass("nomoves");
        return;
    }

    if (piece == "K") {
        safecastle.K && castles.search("K") > -1 && !(GetPieceAtSquare("g1") || []).length && squares.push("g1");
        safecastle.Q && castles.search("Q") > -1 && !(GetPieceAtSquare("c1") || []).length && squares.push("c1");
    }

    $(".square").each((i, elem) => {
        var row = $(elem).attr("data-row");
        var column = $(elem).attr("data-column");
        if (row && column) {
            var tsq = column + row;
            if (squares.indexOf(tsq) > -1) {
                $(elem)
                    .addClass("highlight")
                    .droppable({ disabled: false });
                
                if(danger && !!danger[tsq]){
                    $(elem)
                        .addClass("danger");
                }
            } else {
                $(elem)
                    .removeClass("highlight danger")
                    .droppable({ disabled: true });
            }
        }
    });
}

function GetSquareAt(square: string) {
    var colRow = square.split("");
    return (colRow.length && $(
        ".square[data-column='" +
        colRow[0] + "'][data-row='" +
        colRow[1] + "']"
    )) || null
}

function GetPieceAtSquare(square: string) {
    return GetSquareAt(square)?.find(".piece") || null;
}

function GetSymbol(piece?: JQuery<HTMLElement>){
    return piece && $(piece)?.attr("data-piece") || "x";
}

function GetPoitionOfSquare(square: string) {
    var colRow = square.split("");
    var offset = $(
        ".square[data-column='" +
        colRow[0] + "'][data-row='" +
        colRow[1] + "']"
    ).offset();
    return {
        top: (offset?.top ?? 0) + 2,
        left: (offset?.left ?? 0) + 2,
    }
}

function MakeMove(move: string) {
    ShowHideSpinner(true, turn);
    socket.emit(ChessRequestSub, {
        playerid,
        param: move
    });
}

function GetMoves(piece: string) {
    socket.emit(ChessMovesSub, {
        playerid,
        param: piece
    });
}

function SetBoard(fen: string) {
    socket.emit(ChessSetBoardSub, {
        playerid,
        param: fen
    });
}

function UndoMove() {
    socket.emit(ChessUndoRequest, {
        playerid
    })
}

function KillAnimation(){
    $.fx.off = true;
    setTimeout(() => $.fx.off = false, 0);
}

function ResetGame() {
    AutoPlayOff();
    KillAnimation();
    ShowHideCheck(false, "white", false, false);
    socket.emit(ChessClearRequest, {
        playerid
    })
}

var bestArrow: arrowLine;
function HighlightBestMove(bestmove?: string) {
    if (!bestmove) return;
    if (isMate) return;
    let parts = bestmove.split("");
    let padding = 51;
    let bfcMul = parts[0].charCodeAt(0) - 97;
    let bfrMul = Math.abs(parseInt(parts[1], 10) - 8);
    let btcMul = parts[2].charCodeAt(0) - 97;
    let btrMul = Math.abs(parseInt(parts[3], 10) - 8);
    bestArrow = BestArrow(
        padding + (bfcMul * 102),
        padding + (bfrMul * 102),
        padding + (btcMul * 102),
        padding + (btrMul * 102),
    );
}

function ShowMessage(message: string){
    return toast(message);
}

function AutoMove(move: string){
    !isGameOver && AnimateMove(move, () => MakeMove(move));
}

function SetGlobals(response: ChessResponse){
    currentBoard = response.board ?? initialBoard;
    localStorage.setItem("board", currentBoard);
    pgnHistory = response.pgnhistory ?? [];
    inCheck = response.check ?? false;
    isGameOver = response.gameover ?? false;
    isMate = (response.reason && response.reason.mate) ?? false;
    isStale = (response.reason && response.reason.stale) ?? false;
    nePieces = (response.reason && response.reason.pieces) ?? false;
    isDraw = (response.reason && response.reason.draw) ?? false;
    tfold = (response.reason && response.reason.tfold) ?? false;
    bestmove = response.bestmove ?? "";
}

function ShowHideCheck(check: boolean, color: string, mate: boolean, stale: boolean){
    $(".piece[data-piece='" + (color == "w" ? "K" : "k") + "']" + 
        (stale ? ",.piece[data-piece='" + (color == "w" ? "k" : "K") + "']" : ""))
        .addClass(check ? "check" : "")
        .removeClass(check ? "" : "check")
        .addClass(check && mate ? "mate" : "")
        .removeClass(check && mate ? "" : "mate");
}

function ParseChessResponse(response: ChessResponse) {
    SetGlobals(response);
    ShowHideSpinner(false);
    var _finally = function () {
        Refresh();

        if(isStale){
            ShowHideCheck(true, "white", true, true);
            ShowMessage("Stalemate!")
            QueueWhisper("- Stalemate -", "red");
        }
    
        if(nePieces){
            ShowHideCheck(true, "white", true, true);
            ShowMessage("Insufficient material!")
            QueueWhisper("- Insufficient material -", "red");
        }

        if(isMate){
            ShowMessage("Check Mate!")
            QueueWhisper("- Check Mate -", "red");
        } else if(inCheck && !autoMoveEnabled){
            ShowMessage("Check!")
            QueueWhisper("- Check -", "red");
        }

        if(isDraw){
            ShowHideCheck(true, "white", true, true);
            ShowMessage("Draw!")
            QueueWhisper("- Draw -", "red");
        }

        if(tfold){
            ShowMessage("3-Fold Repeat!")
            QueueWhisper("- 3-Fold Repeat -", "red");
        }

        if(isGameOver){
            ShowMessage("Game Over")
            QueueWhisper("- Game Over -", "red");
            ToggleAutoPlay();
            LockBoard();
            return;
        }

        setTimeout(() => {
            autoMoveEnabled && bestmove ? 
                AutoMove(bestmove) :
                HighlightBestMove(bestmove);
        }, 0) 
    }

    DisableMouseOver();
    DisableDrag();
    DestroyArrow();
    
    if (response.blackmove) {
        return AnimateMove(response.blackmove, _finally);
    }

    _finally();
}

function AnimateMove(move: string, callback: Function){
    if(!move) return;
    let frSq = move.match(/^../g)?.at(0) || "";
    let toSq = move;
    move.length == 5 && (toSq = toSq.slice(0, -1));
    toSq = toSq.replace("+", "").replace("#", "").replace(/=\w/, "").match(/..$/g)?.at(0) || "";
    let attacking = GetPieceAtSquare(frSq);
    let piece = attacking && GetSymbol(attacking);
    let sqCoords = GetPoitionOfSquare(toSq);
    var move = piece + frSq + "-" + toSq;
    
    return (attacking && sqCoords && $(attacking).animate(sqCoords, 1000, "swing", function () {
        
        if(AnimateCastles(move, callback)){
            return;
        }

        if(piece && AnimateEnPassant(piece, toSq, callback)) return;

        return AnimateDead(toSq, Discard(), callback);
    })) || callback();
}

function SetUpSocketListeners() {
    var _verify = function(response: ChessResponse, callback: Function){
        response.playerid == playerid && callback(response);
    }

    socket.on(ChessRequestRes, (r) => _verify(r, ParseChessResponse));
    socket.on(ChessMovesRes, (r) => _verify(r, HighlightSquares));
    socket.on(ChessListener, (r) => _verify(r, () => QueueWhisper(r.whisper)));
    socket.on(ChessSetBoardRes, (r) => _verify(r, (response: ChessResponse) => {
        ShowHideSpinner(false);
        SetGlobals(response);
        ShowHideSpinner(true, "b");
        Refresh();
    }));
    socket.on(ChessErrorRes, (r) => _verify(r, (response: ChessResponse) => {
        console.log(response.error);
        SetGlobals(response);
        Refresh();
    }));
}

function DisableDrag(){
    $(".piece").draggable({ disabled: true });
}

function DisableMouseOver() {
    $(".square")
        .off("mouseover")
        .off("mouseup")
        .off("mouseleave");
}

var TearDown = () => {
    DisableMouseOver();
    socket.off("connect");
    socket.off(ChessRequestRes);
    socket.off(ChessMovesRes);
    socket.off(ChessListener);
    socket.off(ChessSetBoardRes);
    socket.off(ChessErrorRes);
    socket.disconnect();
};

var Init = () => {
    toast.dismiss();
    SetUpSocketListeners();
    setTimeout(AboutInit, 500);
};

$(Init);

$(window).on("unload", TearDown);

function ParseFen(fen: string) {
    var parts = fen.split(" ");

    turn = parts[1];
    castles = parts[2];
    enpass = parts[3];
    halves = parts[4];
    moveCount = parts[5];
    deadPieces = "pppppppprrnnbbqkPPPPPPPPRRNNBBQK";
    alivePieces = "";

    var rows = parts[0].split("/");
    return rows.map((v) => {
        var posArray: any[] = [];
        var pos = v.split("");
        pos.forEach((p) => {
            try {
                var ival = parseInt(p, 10);
                if (ival.toString() == p) {
                    posArray = posArray.concat(new Array(ival).fill(""));
                    return;
                }
            }
            catch (e) {
                console.log(e);
            }
            deadPieces = deadPieces.replace(p, '');
            alivePieces += p;
            posArray.push(p);
        });

        return posArray;
    });
}

var Refresh = function () {
    console.log("unbound");
};

function DeadBoard({ color }: { color: string }) {
    return (
        <div className={`${color}discard`}>
            {
                deadPieces.split("").map(p => {
                    if (p == p.toUpperCase() && color == "white") {
                        return Piece(p, true);
                    }
                    if (p == p.toLowerCase() && color == "black") {
                        return Piece(p, true);
                    }
                })
            }
        </div>
    );
}

function BestMoveShown(){
    return !$(".bestmoveArrow").hasClass("hide");
}

function ToggleBestMove(event: SyntheticEvent){
    var onOff = true;
    if(BestMoveShown()){
        onOff = false;
    }
    if(event.target && $(event.target).closest(".showBestButton").attr("disabled")){
        onOff = false;
    }
    ShowBestMove(onOff);
}

function AutoPlayOn(){
    autoMoveEnabled = true;
    $(".autoPlayOff").addClass("hide");
    $(".autoPlayOn").removeClass("hide");
    $(".showBestButton").attr({ disabled: true });
    !!bestmove && setTimeout(() => AutoMove(bestmove), 0);
}

function AutoPlayOff(){
    autoMoveEnabled = false;
    $(".autoPlayOff").removeClass("hide");
    $(".autoPlayOn").addClass("hide");
    $(".showBestButton").attr({ disabled: false });
}

function ToggleAutoPlay(){
    autoMoveEnabled = !autoMoveEnabled;
    isGameOver && (autoMoveEnabled = false);
    autoMoveEnabled && AutoPlayOn();
    !autoMoveEnabled && AutoPlayOff();
}

function ShowBestMove(onOff: boolean = true) {
    $(".bestmoveArrow").addClass("hide");
    $(".showBestIconOn").addClass("hide");
    $(".showBestIconOff").removeClass("hide");
    if(onOff){
        $(".bestmoveArrow").removeClass("hide");
        $(".showBestIconOff").addClass("hide");
        $(".showBestIconOn").removeClass("hide");
    }
}

function Tester() {
    //LockBoard();
    //ShowMessage("testing 123");
    //SetBoard("rnbqkbnr/ppp1pppp/8/8/P1Pp4/8/1P1PPPPP/RNBQKBNR b KQkq c3 0 3");
}

function Chess() {
    const [load, reload] = useState(new Date().getTime());
    Refresh = function () {
        reload(new Date().getTime());
        setTimeout(() => {
            (turn == "w" && !autoMoveEnabled && !isGameOver) && SetUpDrag();
        }, 0);
    }
    $(".chessMessageContainer")
        .css({
            position: "absolute",
            zIndex: 9999,
            inset: "43% 0",
            pointerEvents: "none",
        });
    return (
        <ChessBody />
    );
}

export default Chess;