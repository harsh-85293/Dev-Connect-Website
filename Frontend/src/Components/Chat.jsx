import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { io } from "socket.io-client"
import { BASE_URL } from "../utils/constants"
import axios from "axios"

const Chat = () => {
    const {targetuserid} = useParams();
    const user = useSelector(store => store.user);
    const [messages, setMessages] = useState([]);
    const [isTargetOnline, setIsTargetOnline] = useState(false);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
      // create socket once on mount
      socketRef.current = io(BASE_URL, { withCredentials: true });
      return () => {
        socketRef.current?.disconnect();
      };
    }, []);

    useEffect(() => {
      if (!user?._id || !socketRef.current) return;
      socketRef.current.emit("register", user._id);

      const onPrivateMessage = (payload) => {
        // Append any incoming message not sent by me
        if (payload.fromUserId !== user._id) {
          setMessages(prev => [...prev, { from: "them", text: payload.message, ts: payload.ts || Date.now() }]);
        }
      };
      socketRef.current.on("private-message", onPrivateMessage);
      const onPresence = ({ userId, online }) => {
        if (userId === targetuserid) setIsTargetOnline(online);
      };
      const onPresenceState = ({ userId, online }) => {
        if (userId === targetuserid) setIsTargetOnline(online);
      }
      socketRef.current.on("presence", onPresence);
      socketRef.current.on("presence:state", onPresenceState);
      // initial query
      socketRef.current.emit("presence:query", { userId: targetuserid });
      return () => {
        socketRef.current?.off("private-message", onPrivateMessage);
        socketRef.current?.off("presence", onPresence);
        socketRef.current?.off("presence:state", onPresenceState);
      };
    }, [user?._id, targetuserid]);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load chat history on open
    useEffect(() => {
      const load = async () => {
        if (!user?._id || !targetuserid) return;
        try {
          const res = await axios.get(`${BASE_URL}/chat/${targetuserid}/history`, { withCredentials: true });
          const history = (res.data?.data || []).map(m => ({
            from: m.fromUserId === user._id ? 'me' : 'them',
            text: m.text,
            ts: new Date(m.ts).getTime(),
          }));
          setMessages(history);
        } catch (e) {
          console.error('Failed to load chat history', e);
        }
      };
      load();
    }, [user?._id, targetuserid]);

    const sendMessage = () => {
      const text = input.trim();
      if (!text || !user?._id) return;
      setMessages(prev => [...prev, { from: "me", text, ts: Date.now() }]);
      socketRef.current?.emit("private-message", { toUserId: targetuserid, message: text, fromUserId: user._id });
      setInput("");
    };

    const handleKey = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    return (
    <div className="min-h-[70vh] max-w-3xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Live Chat</h2>
            <div className={`badge ${isTargetOnline ? 'badge-success' : 'badge-ghost'}`}>
              {isTargetOnline ? 'Online' : 'Offline'}
            </div>
          </div>
          <div className="h-96 overflow-y-auto space-y-2 p-2 bg-base-200 rounded">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat ${m.from === "me" ? "chat-end" : "chat-start"}`}>
                <div className="chat-bubble">
                  {m.text}
                  <div className="text-[10px] opacity-70 mt-1">
                    {new Date(m.ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>
          <div className="mt-3 flex gap-2">
            <textarea
              className="textarea textarea-bordered w-full"
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message"
            />
            <button className="btn btn-primary" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
