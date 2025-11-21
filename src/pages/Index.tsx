import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/components/ChatMessage";
import { TopicCard } from "@/components/TopicCard";
import { FAQButton } from "@/components/FAQButton";
import {
  Send,
  Bot,
  Heart,
  Shield,
  Pill,
  AlertTriangle,
  ThermometerSun,
  Clock,
  Bug,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("malaria-chat", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) {
        console.error("Function error:", error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || "I'm here to help with malaria information.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleTopicClick = (topic: string) => {
    sendMessage(`Tell me about ${topic}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Anti-Malarial Health Assistant</h1>
              <p className="text-xs text-muted-foreground">
                Your trusted guide for malaria prevention & care
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="p-6 bg-gradient-to-br from-[hsl(var(--medical-blue-light))] to-background border-2 border-primary/20">
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 bg-primary rounded-full">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Welcome! How can I help you today?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  I'm your Anti-Malarial Health Assistant, here to provide reliable WHO-based
                  information about malaria prevention, symptoms, treatment, and more.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Educational information only - Always consult healthcare professionals</span>
                </div>
              </div>
            </Card>

            {/* Topic Cards */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Explore Topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TopicCard
                  icon={ThermometerSun}
                  title="Symptoms"
                  description="Learn about malaria symptoms and warning signs"
                  onClick={() => handleTopicClick("malaria symptoms and when to seek help")}
                  color="blue"
                />
                <TopicCard
                  icon={Shield}
                  title="Prevention"
                  description="Effective ways to prevent malaria infection"
                  onClick={() => handleTopicClick("malaria prevention methods")}
                  color="green"
                />
                <TopicCard
                  icon={Pill}
                  title="Treatment"
                  description="Antimalarial medications and treatment options"
                  onClick={() => handleTopicClick("malaria treatment and medications")}
                  color="blue"
                />
                <TopicCard
                  icon={Bug}
                  title="Mosquito Control"
                  description="How to control and eliminate mosquitoes"
                  onClick={() => handleTopicClick("mosquito control methods")}
                  color="green"
                />
                <TopicCard
                  icon={MapPin}
                  title="High-Risk Areas"
                  description="Regions where malaria is most prevalent"
                  onClick={() => handleTopicClick("malaria high-risk areas")}
                  color="amber"
                />
                <TopicCard
                  icon={Clock}
                  title="Medication Reminders"
                  description="Tips for taking antimalarial drugs on schedule"
                  onClick={() => handleTopicClick("medication reminder tips")}
                  color="blue"
                />
              </div>
            </div>

            <Separator />

            {/* Quick FAQs */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FAQButton
                  icon={ThermometerSun}
                  question="What are the early symptoms of malaria?"
                  onClick={() => handleQuickQuestion("What are the early symptoms of malaria?")}
                />
                <FAQButton
                  icon={Pill}
                  question="Which antimalarial drugs are most effective?"
                  onClick={() =>
                    handleQuickQuestion("Which antimalarial drugs are most effective?")
                  }
                />
                <FAQButton
                  icon={Shield}
                  question="How can I prevent malaria?"
                  onClick={() => handleQuickQuestion("How can I prevent malaria?")}
                />
                <FAQButton
                  icon={AlertTriangle}
                  question="When should I seek urgent medical care?"
                  onClick={() =>
                    handleQuickQuestion("When should I seek urgent medical care for malaria?")
                  }
                />
              </div>
            </div>

            {/* Disclaimer */}
            <Card className="p-4 bg-muted border-amber-200 dark:border-amber-900">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold">Medical Disclaimer</p>
                  <p className="text-muted-foreground">
                    This chatbot provides educational information only and should not replace
                    professional medical advice. Always consult a licensed healthcare provider for
                    diagnosis, treatment, and personalized medical advice. In case of emergency
                    symptoms, seek immediate medical attention.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Chat View
          <Card className="h-[calc(100vh-12rem)]">
            <ScrollArea className="h-[calc(100%-5rem)] p-4" ref={scrollRef}>
              {messages.map((message, index) => (
                <ChatMessage key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Bot className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden rounded-lg bg-card border border-border px-4 py-3">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about malaria symptoms, prevention, treatment..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
