'use client';

import { useEffect, useRef, useState } from "react";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatSiniestroProps {
    siniestroId: string;
}

export function ChatSiniestro({ siniestroId }: ChatSiniestroProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const mensajesQuery = useMemoFirebase(() => {
        if (!firestore || !siniestroId) return null;
        return query(
            collection(firestore, `siniestros/${siniestroId}/mensajes`),
            orderBy('timestamp', 'asc')
        );
    }, [firestore, siniestroId]);

    const { data: mensajes, isLoading } = useCollection(mensajesQuery);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !firestore || isSending) return;

        setIsSending(true);
        const mensajesCollection = collection(firestore, `siniestros/${siniestroId}/mensajes`);

        try {
            await addDoc(mensajesCollection, {
                text: newMessage,
                senderId: user.uid,
                senderName: user.displayName || user.email,
                senderRole: "perito", // This should be dynamic in a real app
                timestamp: serverTimestamp(),
                siniestroId: siniestroId,
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="flex h-[600px] flex-col">
            <CardHeader>
                <CardTitle>Chat del Siniestro</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                
                {!isLoading && mensajes?.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-muted-foreground">Aún no hay mensajes. ¡Inicia la conversación!</p>
                    </div>
                )}

                {mensajes?.map(msg => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === user?.uid ? "justify-end" : "justify-start")}>
                        {msg.senderId !== user?.uid && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>{msg.senderName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-xs md:max-w-md rounded-lg px-3 py-2", msg.senderId === user?.uid ? "bg-primary text-primary-foreground" : "bg-muted")}>
                           <p className="text-sm font-bold">{msg.senderName}</p>
                           <p className="text-sm">{msg.text}</p>
                           <p className="text-xs opacity-70 mt-1 text-right">
                                {msg.timestamp ? formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true, locale: es }) : ''}
                           </p>
                        </div>
                         {msg.senderId === user?.uid && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>{user?.displayName?.substring(0,2).toUpperCase() || 'YO'}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}

    