"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Plus,
	QrCode,
	FileText,
	Users,
	CheckCircle,
	Eye,
	Download,
	X,
	AlertCircle,
} from "lucide-react";
import QRCode from "react-qr-code";
import { OfficeAdminLayout } from "@/components/office-admin/layout";

interface EvaluationForm {
	id: string;
	title: string;
	description: string;
	office: string;
	services: string[];
	questions: {
		id: string;
		question: string;
		type: "rating" | "text" | "yes_no";
		required: boolean;
	}[];
	createdAt: string;
	status: "active" | "draft" | "archived";
	qrCode?: string;
}

export default function EvaluationPage() {
	const [evaluationForms, setEvaluationForms] = useState<EvaluationForm[]>([]);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showQRModal, setShowQRModal] = useState(false);
	const [selectedForm, setSelectedForm] = useState<EvaluationForm | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	// Current office admin info (would come from auth context in real app)
	const currentAdmin = {
		office: "Registrar Office",
		name: "Office Administrator",
	};

	// Form creation state
	const [newForm, setNewForm] = useState({
		title: "",
		description: "",
		services: [] as string[],
		questions: [] as any[],
	});

	// Available services for this office
	const availableServices = [
		"Transcript Request",
		"Certificate Issuance",
		"Enrollment",
		"Grade Verification",
		"Document Authentication",
		"Academic Records",
	];

	useEffect(() => {
		setIsMounted(true);
		loadEvaluationForms();
	}, []);

	const loadEvaluationForms = () => {
		// In a real app, this would fetch from an API
		const sampleForms: EvaluationForm[] = [
			{
				id: "eval-001",
				title: "General Service Evaluation",
				description: "Standard evaluation form for all registrar services",
				office: currentAdmin.office,
				services: ["Transcript Request", "Certificate Issuance"],
				questions: [
					{
						id: "q1",
						question: "How would you rate the overall service quality?",
						type: "rating",
						required: true,
					},
					{
						id: "q2",
						question: "How long did you wait to be served?",
						type: "rating",
						required: true,
					},
					{
						id: "q3",
						question: "Any additional comments or suggestions?",
						type: "text",
						required: false,
					},
				],
				createdAt: new Date().toISOString(),
				status: "active",
			},
			{
				id: "eval-002",
				title: "Priority Lane Evaluation",
				description: "Specialized evaluation for priority customers",
				office: currentAdmin.office,
				services: ["All Services"],
				questions: [
					{
						id: "q1",
						question: "Was your priority status properly recognized?",
						type: "yes_no",
						required: true,
					},
					{
						id: "q2",
						question: "Rate the staff's assistance with your priority needs",
						type: "rating",
						required: true,
					},
				],
				createdAt: new Date().toISOString(),
				status: "draft",
			},
		];
		setEvaluationForms(sampleForms);
	};

	const generateQRCode = (form: EvaluationForm) => {
		const qrData = {
			type: "evaluation_form",
			formId: form.id,
			office: currentAdmin.office,
			title: form.title,
			services: form.services,
			url: `${window.location.origin}/customer/evaluation/${form.id}`,
			generatedAt: new Date().toISOString(),
		};

		// Store QR data
		localStorage.setItem(`evaluation_qr_${form.id}`, JSON.stringify(qrData));

		setSelectedForm(form);
		setShowQRModal(true);
	};

	const downloadQR = (form: EvaluationForm) => {
		// In a real app, this would generate and download a high-quality QR code
		alert(`QR code for "${form.title}" would be downloaded as PDF/PNG`);
	};

	const addQuestion = () => {
		const newQuestion = {
			id: `q${newForm.questions.length + 1}`,
			question: "",
			type: "rating" as const,
			required: true,
		};
		setNewForm({
			...newForm,
			questions: [...newForm.questions, newQuestion],
		});
	};

	const updateQuestion = (index: number, field: string, value: any) => {
		const updatedQuestions = [...newForm.questions];
		updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
		setNewForm({ ...newForm, questions: updatedQuestions });
	};

	const removeQuestion = (index: number) => {
		const updatedQuestions = newForm.questions.filter((_, i) => i !== index);
		setNewForm({ ...newForm, questions: updatedQuestions });
	};

	const saveForm = () => {
		if (!newForm.title || newForm.questions.length === 0) {
			alert("Please fill in the form title and add at least one question.");
			return;
		}

		const form: EvaluationForm = {
			id: `eval-${Date.now()}`,
			title: newForm.title,
			description: newForm.description,
			office: currentAdmin.office,
			services: newForm.services,
			questions: newForm.questions,
			createdAt: new Date().toISOString(),
			status: "draft",
		};

		setEvaluationForms([...evaluationForms, form]);
		setNewForm({ title: "", description: "", services: [], questions: [] });
		setShowCreateForm(false);

		alert("Evaluation form created successfully!");
	};

	const toggleFormStatus = (formId: string) => {
		setEvaluationForms(
			evaluationForms.map((form) =>
				form.id === formId
					? {
							...form,
							status: form.status === "active" ? "draft" : "active",
					  }
					: form
			)
		);
	};

	if (!isMounted) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<OfficeAdminLayout
			title="Evaluation Forms"
			description="Create and manage customer evaluation forms"
		>
			<div className="space-y-6">
				{/* Header with Create Button */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Evaluation Forms
						</h1>
						<p className="text-gray-600">
							Create evaluation forms and generate QR codes for customer
							feedback
						</p>
					</div>
					<Button
						onClick={() => setShowCreateForm(true)}
						className="gradient-primary text-white"
					>
						<Plus className="w-4 h-4 mr-2" />
						Create New Form
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Total Forms</p>
									<p className="text-2xl font-bold text-[#071952]">
										{evaluationForms.length}
									</p>
								</div>
								<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<FileText className="w-5 h-5 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Active Forms</p>
									<p className="text-2xl font-bold text-[#071952]">
										{
											evaluationForms.filter((f) => f.status === "active")
												.length
										}
									</p>
								</div>
								<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
									<CheckCircle className="w-5 h-5 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Draft Forms</p>
									<p className="text-2xl font-bold text-[#071952]">
										{
											evaluationForms.filter((f) => f.status === "draft")
												.length
										}
									</p>
								</div>
								<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
									<AlertCircle className="w-5 h-5 text-yellow-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">QR Codes</p>
									<p className="text-2xl font-bold text-[#071952]">
										{
											evaluationForms.filter((f) => f.status === "active")
												.length
										}
									</p>
								</div>
								<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
									<QrCode className="w-5 h-5 text-purple-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Evaluation Forms List */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="w-5 h-5 text-blue-600" />
							Evaluation Forms
						</CardTitle>
						<CardDescription>
							Manage evaluation forms for {currentAdmin.office}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{evaluationForms.length > 0 ? (
								evaluationForms.map((form) => (
									<div
										key={form.id}
										className="border rounded-lg p-4 space-y-3"
									>
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold text-lg">
														{form.title}
													</h3>
													<Badge
														className={
															form.status === "active"
																? "bg-green-100 text-green-800"
																: form.status === "draft"
																? "bg-yellow-100 text-yellow-800"
																: "bg-gray-100 text-gray-800"
														}
													>
														{form.status}
													</Badge>
												</div>
												<p className="text-gray-600">{form.description}</p>
												<div className="flex flex-wrap gap-2">
													{form.services.map((service, index) => (
														<Badge
															key={index}
															variant="outline"
															className="text-xs"
														>
															{service}
														</Badge>
													))}
												</div>
												<p className="text-xs text-gray-500">
													{form.questions.length} questions • Created{" "}
													{new Date(form.createdAt).toLocaleDateString()}
												</p>
											</div>
											<div className="flex gap-2">
												<Button
													onClick={() => generateQRCode(form)}
													variant="outline"
													size="sm"
													disabled={form.status !== "active"}
												>
													<QrCode className="w-4 h-4 mr-2" />
													Generate QR
												</Button>
												<Button
													onClick={() => toggleFormStatus(form.id)}
													variant="outline"
													size="sm"
												>
													{form.status === "active" ? "Deactivate" : "Activate"}
												</Button>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8">
									<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500">No evaluation forms created yet</p>
									<Button
										onClick={() => setShowCreateForm(true)}
										className="mt-4"
									>
										Create Your First Form
									</Button>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Create Form Modal */}
			{showCreateForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Create Evaluation Form</h2>
								<Button
									onClick={() => setShowCreateForm(false)}
									variant="outline"
									size="sm"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>

							<div className="space-y-4">
								<div>
									<Label htmlFor="title">Form Title</Label>
									<Input
										id="title"
										value={newForm.title}
										onChange={(e) =>
											setNewForm({ ...newForm, title: e.target.value })
										}
										placeholder="e.g., General Service Evaluation"
									/>
								</div>

								<div>
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={newForm.description}
										onChange={(e) =>
											setNewForm({ ...newForm, description: e.target.value })
										}
										placeholder="Brief description of this evaluation form"
									/>
								</div>

								<div>
									<Label>Services (Select applicable services)</Label>
									<div className="grid grid-cols-2 gap-2 mt-2">
										{availableServices.map((service) => (
											<label
												key={service}
												className="flex items-center space-x-2"
											>
												<input
													type="checkbox"
													checked={newForm.services.includes(service)}
													onChange={(e) => {
														if (e.target.checked) {
															setNewForm({
																...newForm,
																services: [...newForm.services, service],
															});
														} else {
															setNewForm({
																...newForm,
																services: newForm.services.filter(
																	(s) => s !== service
																),
															});
														}
													}}
												/>
												<span className="text-sm">{service}</span>
											</label>
										))}
									</div>
								</div>

								<div>
									<div className="flex items-center justify-between mb-3">
										<Label>Questions</Label>
										<Button onClick={addQuestion} variant="outline" size="sm">
											<Plus className="w-4 h-4 mr-2" />
											Add Question
										</Button>
									</div>

									<div className="space-y-3">
										{newForm.questions.map((question, index) => (
											<div
												key={index}
												className="border rounded-lg p-3 space-y-3"
											>
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium">
														Question {index + 1}
													</span>
													<Button
														onClick={() => removeQuestion(index)}
														variant="outline"
														size="sm"
													>
														<X className="w-3 h-3" />
													</Button>
												</div>

												<Input
													value={question.question}
													onChange={(e) =>
														updateQuestion(index, "question", e.target.value)
													}
													placeholder="Enter your question"
												/>

												<div className="flex gap-4">
													<div>
														<Label className="text-xs">Type</Label>
														<Select
															value={question.type}
															onValueChange={(value) =>
																updateQuestion(index, "type", value)
															}
														>
															<SelectTrigger className="w-32">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="rating">Rating</SelectItem>
																<SelectItem value="text">Text</SelectItem>
																<SelectItem value="yes_no">Yes/No</SelectItem>
															</SelectContent>
														</Select>
													</div>

													<label className="flex items-center space-x-2">
														<input
															type="checkbox"
															checked={question.required}
															onChange={(e) =>
																updateQuestion(
																	index,
																	"required",
																	e.target.checked
																)
															}
														/>
														<span className="text-xs">Required</span>
													</label>
												</div>
											</div>
										))}

										{newForm.questions.length === 0 && (
											<div className="text-center py-4 text-gray-500">
												No questions added yet. Click "Add Question" to get
												started.
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="flex gap-3 pt-4 border-t">
								<Button onClick={saveForm} className="flex-1">
									Save Form
								</Button>
								<Button
									onClick={() => setShowCreateForm(false)}
									variant="outline"
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* QR Code Modal */}
			{showQRModal && selectedForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<div className="text-center space-y-4">
							<h3 className="text-lg font-semibold">QR Code Generated</h3>
							<p className="text-gray-600">
								QR Code for "{selectedForm.title}"
							</p>

							<div className="bg-gray-50 p-6 rounded-lg">
								<QRCode
									value={JSON.stringify({
										type: "evaluation_form",
										formId: selectedForm.id,
										office: currentAdmin.office,
										title: selectedForm.title,
										url: `${window.location.origin}/customer/evaluation/${selectedForm.id}`,
									})}
									size={200}
									style={{ height: "auto", maxWidth: "100%", width: "100%" }}
								/>
							</div>

							<div className="flex gap-3">
								<Button
									onClick={() => downloadQR(selectedForm)}
									className="flex-1"
								>
									<Download className="w-4 h-4 mr-2" />
									Download QR
								</Button>
								<Button
									onClick={() => setShowQRModal(false)}
									variant="outline"
									className="flex-1"
								>
									Close
								</Button>
							</div>

							<div className="text-xs text-gray-500 bg-gray-100 p-3 rounded">
								<p>
									<strong>Instructions:</strong> Print this QR code and place it
									where customers can easily scan it after receiving service.
									The QR code will direct them to the evaluation form.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</OfficeAdminLayout>
	);
}
