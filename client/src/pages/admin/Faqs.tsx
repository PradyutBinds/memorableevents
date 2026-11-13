import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq, getAdminListFaqsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export default function Faqs() {
  const { data: faqs, isLoading } = useAdminListFaqs();
  const createItem = useCreateFaq();
  const updateItem = useUpdateFaq();
  const deleteItem = useDeleteFaq();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      question: "",
      answer: "",
      sortOrder: 0,
      isActive: true,
    });
    setIsOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      updateItem.mutate({ id: editingId, data: values }, {
        onSuccess: () => {
          toast({ title: "FAQ updated" });
          queryClient.invalidateQueries({ queryKey: getAdminListFaqsQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      createItem.mutate({ data: values }, {
        onSuccess: () => {
          toast({ title: "FAQ added" });
          queryClient.invalidateQueries({ queryKey: getAdminListFaqsQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    deleteItem.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "FAQ deleted" });
        queryClient.invalidateQueries({ queryKey: getAdminListFaqsQueryKey() });
      }
    });
  };

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold tracking-tight">FAQs</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" /> Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="question" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="answer" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl><Textarea className="h-24" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <FormField control={form.control} name="sortOrder" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="isActive" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 mt-8">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full" disabled={createItem.isPending || updateItem.isPending}>
                    {(createItem.isPending || updateItem.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save FAQ
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {faqs?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {item.question}
                    {!item.isActive && <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded text-red-500">Inactive</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{item.answer}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}