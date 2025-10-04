"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const editOfficeSchema = z.object({
  name: z.string().min(2, "Office name must be at least 2 characters"),
  type: z.string().min(2, "Office type must be at least 2 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  focalPerson: z.string().min(2, "Focal person name must be at least 2 characters"),
  focalPersonEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  focalPersonPhone: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive", "Maintenance"]),
});

type EditOfficeForm = z.infer<typeof editOfficeSchema>;

interface Office {
  id: string;
  name: string;
  type: string;
  location: string;
  focalPerson: string;
  focalPersonEmail?: string;
  focalPersonPhone?: string;
  status: "Active" | "Inactive" | "Maintenance";
  createdAt?: any;
  updatedAt?: any;
}

interface EditOfficeFormProps {
  office: Office;
  onOfficeUpdated?: () => void;
}

export default function EditOfficeForm({ office, onOfficeUpdated }: EditOfficeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditOfficeForm>({
    resolver: zodResolver(editOfficeSchema),
    defaultValues: {
      name: office.name,
      type: office.type,
      location: office.location,
      focalPerson: office.focalPerson,
      focalPersonEmail: office.focalPersonEmail || "",
      focalPersonPhone: office.focalPersonPhone || "",
      status: office.status,
    },
  });

  // Reset form when office changes
  useEffect(() => {
    form.reset({
      name: office.name,
      type: office.type,
      location: office.location,
      focalPerson: office.focalPerson,
      focalPersonEmail: office.focalPersonEmail || "",
      focalPersonPhone: office.focalPersonPhone || "",
      status: office.status,
    });
  }, [office, form]);

  const onSubmit = async (data: EditOfficeForm) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/offices", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: office.id,
          ...data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        onOfficeUpdated?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="hover:bg-[#071952]/10 hover:border-[#071952]/30 hover:text-[#071952] transition-all duration-200"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Office</DialogTitle>
          <DialogDescription>
            Update the office information and configuration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Office Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-1.5 w-full">
                    <FormLabel className="text-gray-900 text-sm">Office Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Registrar Office" 
                        className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]"
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Office Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-1.5 w-full">
                    <FormLabel className="text-gray-900 text-sm">Office Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Academic, Administrative, Support" 
                        className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]"
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location and Focal Person */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-1.5 w-full">
                      <FormLabel className="text-gray-900 text-sm">Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Building A, Room 101" 
                          className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="focalPerson"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-1.5 w-full">
                      <FormLabel className="text-gray-900 text-sm">Focal Person / Head</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., John Doe" 
                          className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="focalPersonEmail"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-1.5 w-full">
                      <FormLabel className="text-gray-900 text-sm">Email (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="e.g., john.doe@university.edu" 
                          className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="focalPersonPhone"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-1.5 w-full">
                      <FormLabel className="text-gray-900 text-sm">Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="e.g., +1 (555) 123-4567" 
                          className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-1.5 w-full">
                    <FormLabel className="text-gray-900 text-sm">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-white text-gray-900 border border-gray-300 focus-visible:ring-[#088395]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Note about services */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Services are managed by the office admin.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#071952] hover:bg-[#071952]/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating Office...
                  </>
                ) : (
                  "Update Office"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
