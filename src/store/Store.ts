import { UserId } from "../schema/Chat.schema";

export abstract class Store {
     constructor() {
     }
     initRoom(roomId: string): void {
         // Initialize room logic here
     }
     getChats(room:string,limit:number,offset:number){
         // Fetch chats for the room with a limit
     }
     addChat(userId:UserId,name:string,room:string,message:string){

     }
     upvote(userId:UserId,room:string,chatId:string){

     }
}