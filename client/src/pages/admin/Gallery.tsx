import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListGallery, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem, getAdminListGalleryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
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
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export default function Gallery() {
  const { data: gallery, isLoading } = useAdminListGallery();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      imageUrl: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      description: item.description || "",
      category: item.category,
      imageUrl: item.imageUrl,
      isActive: item.isActive,
      sortOrder: item.sortOrder || 0,
    });
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      title: "",
      description: "",
      category: "General",
      imageUrl: "",
      isActive: true,
      sortOrder: 0,
    });
    setIsOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      updateItem.mutate({ id: editingId, data: values }, {
        onSuccess: () => {
          toast({ title: "Image updated" });
          queryClient.invalidateQueries({ queryKey: getAdminListGalleryQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      createItem.mutate({ data: values }, {
        onSuccess: () => {
          toast({ title: "Image added" });
          queryClient.invalidateQueries({ queryKey: getAdminListGalleryQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    deleteItem.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Image deleted" });
        queryClient.invalidateQueries({ queryKey: getAdminListGalleryQueryKey() });
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
          <h1 className="text-3xl font-serif font-bold tracking-tight">Gallery</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" /> Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Image" : "Add New Image"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea className="h-20" {...field} /></FormControl>
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
                    Save Image
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery?.map((item) => (
            <Card key={item.id} className="overflow-hidden group relative">
              <div className="aspect-square bg-muted relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div className="text-white text-center p-2">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-xs">{item.category}</p>
                    {!item.isActive && <span className="text-xs text-red-300 mt-1 block">Inactive</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}