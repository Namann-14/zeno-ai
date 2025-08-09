'use client'
import { Button } from "@workspace/ui/components/button"
import { useVapi } from "@/modules/widgets/hooks/use-vapi";

export default function Page() {
  const {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  } = useVapi();
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Button 
          onClick={() => startCall()} 
          disabled={isConnecting || isConnected}
        >
          {isConnecting ? 'Connecting...' : 'Start Call'}
        </Button>
        <Button 
          onClick={() => endCall()} 
          variant="destructive"
          disabled={!isConnected}
        >
          End Call
        </Button>
        <div className="text-sm space-y-1">
          <p>Connected: {`${isConnected}`}</p>
          <p>Connecting: {`${isConnecting}`}</p>
          <p>Speaking: {`${isSpeaking}`}</p>
        </div>
        {transcript.length > 0 && (
          <div className="w-full max-w-md">
            <h3 className="font-semibold mb-2">Transcript:</h3>
            <div className="space-y-2">
              {transcript.map((msg, index) => (
                <div key={index} className={`p-2 rounded ${
                  msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <span className="font-medium">{msg.role}:</span> {msg.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
