import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from "socket.io";
type ChessRequest = {
    playerid?: string;
    param?: string;
};
export declare class SocketFish implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    onChessMovesRequest(request: ChessRequest, socket: Socket): void;
    onChessRequest(request: ChessRequest, socket: Socket): void;
    onChessUndoRequest(request: ChessRequest, socket: Socket): void;
    onChessClearRequest(request: ChessRequest, socket: Socket): void;
    onChessSetBoardRequest(request: ChessRequest, socket: Socket): void;
}
export {};
