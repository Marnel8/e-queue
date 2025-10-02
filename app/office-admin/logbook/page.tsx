"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

type Entry = {
    id: string;
    customer: string;
    department: string;
    service: string;
    time: string;
    date: string;
    evaluated: boolean;
};

const FilterSchema = z.object({
    date: z.string().optional(),
});
type FilterForm = z.infer<typeof FilterSchema>;

export default function LogbookPage() {
    const { userData } = useAuth();
    const { toast } = useToast();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FilterForm>({
        resolver: zodResolver(FilterSchema),
        defaultValues: { date: "" },
    });

    const loadEntries = async (date?: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if ((userData as any)?.office) params.set("office", (userData as any).office);
            if ((userData as any)?.officeId) params.set("officeId", (userData as any).officeId);
            if ((userData as any)?.department) params.set("department", (userData as any).department);
            if (date) params.set("date", date);
            const res = await fetch(`/api/office-admin/logbook?${params.toString()}`, { cache: "no-store" });
            const json = await res.json();
            if (json?.success && Array.isArray(json.entries)) {
                setEntries(json.entries);
                toast({ title: "Loaded", description: "Logbook updated." });
            } else {
                setEntries([]);
                toast({ title: "No data", description: json?.message ?? "No entries found.", variant: "destructive" });
            }
        } catch (e) {
            setEntries([]);
            toast({ title: "Error", description: "Failed to load logbook.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // initial load once userData is available
        if (userData) {
            loadEntries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    const onSubmit = form.handleSubmit(async (values) => {
        await loadEntries(values.date || undefined);
    });

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Transaction Logbook
					</h1>
					<p className="text-gray-600">
						Printable queue history with evaluation status
					</p>
				</div>
                <Button onClick={() => window.print()} disabled={isLoading}>
                    {isLoading ? "Preparing..." : "Print Logbook"}
                </Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Today's Transactions</CardTitle>
					<CardDescription>Completed and in-progress entries</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
                        <form onSubmit={onSubmit} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="date">Filter by Date:</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    {...form.register("date")}
                                    className="w-auto"
                                />
                            </div>
                            <Button type="submit" size="sm" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Apply"}
                            </Button>
                            {(form.watch("date") || "") !== "" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        form.reset({ date: "" });
                                        loadEntries();
                                    }}
                                    size="sm"
                                    disabled={isLoading}
                                >
                                    Clear Filter
                                </Button>
                            )}
                        </form>

						<div className="space-y-3">
                            {entries.map((e) => (
								<div
									key={e.id}
									className="flex items-center justify-between p-3 border rounded"
								>
									<div className="min-w-0">
										<div className="font-medium truncate">
											#{e.id} • {e.customer}
										</div>
										<div className="text-xs text-gray-600 truncate">
                                            {e.department} • {e.service} • {e.date} • {e.time}
										</div>
									</div>
									<Badge
										className={
											e.evaluated
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}
									>
										{e.evaluated ? "Evaluation Complete" : "Evaluation Pending"}
									</Badge>
								</div>
							))}
						</div>

                        {entries.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								No transactions found for the selected date.
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
