import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListMessages, useUpdateMessage, useDeleteMessage, getAdminListMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Trash2, Mail, MailOpen, Search, Filter, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Messages() {
  const { data: messages, isLoading } = useAdminListMessages();
  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = (messages || []).filter(m => {
    const matchesFilter = filter === "all" || (filter === "unread" ? !m.isRead : m.isRead);
    const q = search.toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleMarkRead = (id: number, isRead: boolean) => {
    updateMessage.mutate({ id, data: { isRead: !isRead } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey() }),
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this message permanently?")) return;
    deleteMessage.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Message deleted" });
        queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey() });
        if (selected?.id === id) setSelected(null);
      },
      onError: () => toast({ title: "Error", description: "Failed to delete message", variant: "destructive" }),
    });
  };

  const unreadCount = (messages || []).filter(m => !m.isRead).length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              Messages
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">{unreadCount} new</span>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{messages?.length || 0} total enquiries received</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search messages…"
              className="pl-10 rounded-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px] rounded-none">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Split View */}
        <div className="grid lg:grid-cols-5 gap-4 min-h-[600px]">
          {/* Message List */}
          <div className="lg:col-span-2 border border-border rounded-xl overflow-hidden bg-card">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-sm font-medium text-muted-foreground">{filtered.length} messages</p>
            </div>
            <div className="overflow-y-auto max-h-[600px] divide-y divide-border">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No messages found</p>
                </div>
              ) : (
                filtered.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelected(msg);
                      if (!msg.isRead) handleMarkRead(msg.id, false);
                    }}
                    className={`w-full text-left p-4 hover:bg-muted/40 transition-colors ${selected?.id === msg.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {!msg.isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        <span className={`text-sm truncate ${!msg.isRead ? "font-semibold text-foreground" : "text-foreground/80"}`}>{msg.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{format(new Date(msg.createdAt), "MMM dd")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{msg.message}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3 border border-border rounded-xl bg-card overflow-hidden">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {/* Message Header */}
                  <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {selected.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground">{selected.name}</span>
                        {!selected.isRead && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">New</span>}
                      </div>
                      <p className="text-sm text-muted-foreground ml-10">{selected.email}</p>
                      {selected.phone && <p className="text-sm text-muted-foreground ml-10">{selected.phone}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none h-8 text-xs"
                        onClick={() => handleMarkRead(selected.id, selected.isRead)}
                      >
                        {selected.isRead ? <Mail className="w-3.5 h-3.5 mr-1" /> : <MailOpen className="w-3.5 h-3.5 mr-1" />}
                        {selected.isRead ? "Mark unread" : "Mark read"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(selected.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-8">
                      <span>Received {format(new Date(selected.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</span>
                    </div>
                    <div className="bg-muted/30 border border-border rounded-lg p-6">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <a href={`mailto:${selected.email}`}>
                        <Button size="sm" className="rounded-none h-9 text-xs uppercase tracking-widest">
                          Reply via Email
                        </Button>
                      </a>
                      {selected.phone && (
                        <a href={`tel:${selected.phone}`}>
                          <Button size="sm" variant="outline" className="rounded-none h-9 text-xs uppercase tracking-widest">
                            Call Client
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8"
                >
                  <Eye className="w-10 h-10 text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground font-medium">Select a message to read</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">Click any message from the list</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
