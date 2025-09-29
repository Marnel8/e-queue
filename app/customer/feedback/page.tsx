"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send, MessageSquare } from "lucide-react";

const FeedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
  experience: z.string().min(10, "Please provide at least 10 characters").max(1000, "Experience must be less than 1000 characters"),
  suggestions: z.string().max(1000, "Suggestions must be less than 1000 characters").optional(),
});

type FeedbackForm = z.infer<typeof FeedbackSchema>;

function FeedbackForm() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<any[]>([]);

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      rating: 0,
      experience: "",
      suggestions: "",
    },
  });

  const onSubmit = async (values: FeedbackForm) => {
    if (!user?.uid || !userData) {
      toast({
        title: "Error",
        description: "Please log in to submit feedback",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: userData.name || "Anonymous",
          customerEmail: userData.email,
          service: "System Evaluation",
          rating: values.rating,
          comment: values.experience + (values.suggestions ? `\n\nSuggestions: ${values.suggestions}` : ""),
          officeId: (userData as any).officeId || "default",
          userId: user.uid,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Thank you for your feedback! It has been submitted successfully."
        });
        
        // Reset form
        form.reset();
        setRating(0);
        setHoveredRating(0);
        
        // Add to submitted feedback list
        setSubmittedFeedback(prev => [{
          id: result.feedbackId,
          rating: values.rating,
          experience: values.experience,
          suggestions: values.suggestions,
          date: new Date().toLocaleDateString(),
        }, ...prev]);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit feedback",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            System Evaluation
          </CardTitle>
          <CardDescription>
            Your feedback helps us improve the e-queue system and user
            experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Overall System Rating *</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => {
                      setRating(star);
                      form.setValue("rating", star);
                    }}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 && `${rating} out of 5 stars`}
                </span>
              </div>
              {form.formState.errors.rating && (
                <p className="text-sm text-red-600">{form.formState.errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">System Experience *</Label>
              <Textarea
                id="experience"
                placeholder="Tell us about your experience using the e-queue system..."
                className="min-h-[120px]"
                {...form.register("experience")}
              />
              {form.formState.errors.experience && (
                <p className="text-sm text-red-600">{form.formState.errors.experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestions">Suggestions for Improvement</Label>
              <Textarea
                id="suggestions"
                placeholder="How can we improve the e-queue system?"
                className="min-h-[80px]"
                {...form.register("suggestions")}
              />
              {form.formState.errors.suggestions && (
                <p className="text-sm text-red-600">{form.formState.errors.suggestions.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary text-white"
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Evaluation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Evaluations</CardTitle>
          <CardDescription>
            System evaluations you've submitted in the past
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submittedFeedback.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No evaluations yet</p>
              <p className="text-sm">Submit your first evaluation above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedFeedback.map((feedback, index) => (
                <div key={feedback.id || index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">System Evaluation</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= feedback.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feedback.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {feedback.experience}
                  </p>
                  {feedback.suggestions && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-xs font-medium text-gray-600 mb-1">Suggestions:</p>
                      <p className="text-sm text-muted-foreground">{feedback.suggestions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Feedback() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <FeedbackForm />;
}
