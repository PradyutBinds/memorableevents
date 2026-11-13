import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListServices, useCreateService, useUpdateService, useDeleteService, getAdminListServicesQueryKey } from "@workspace/api-client-react";
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
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  price: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export default function Services() {
  const { data: services, isLoading } = useAdminListServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      price: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    form.reset({
      name: service.name,
      description: service.description,
      category: service.category,
      imageUrl: service.imageUrl || "",
      price: service.price || "",
      isActive: service.isActive,
      sortOrder: service.sortOrder || 0,
    });
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      description: "",
      category: "General",
      imageUrl: "",
      price: "",
      isActive: true,
      sortOrder: 0,
    });
    setIsOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      updateService.mutate({ id: editingId, data: values }, {
        onSuccess: () => {
          toast({ title: "Service updated" });
          queryClient.invalidateQueries({ queryKey: getAdminListServicesQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      createService.mutate({ data: values }, {
        onSuccess: () => {
          toast({ title: "Service created" });
          queryClient.invalidateQueries({ queryKey: getAdminListServicesQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    deleteService.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Service deleted" });
        queryClient.invalidateQueries({ queryKey: getAdminListServicesQueryKey() });
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
          <h1 className="text-3xl font-serif font-bold tracking-tight">Services</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Service" : "Add New Service"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
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
                      <FormControl><Textarea className="h-24" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Details (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
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
                  <Button type="submit" className="w-full" disabled={createService.isPending || updateService.isPending}>
                    {(createService.isPending || updateService.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Service
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {services?.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                  {service.imageUrl && <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {!service.isActive && <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(service.id)}>
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