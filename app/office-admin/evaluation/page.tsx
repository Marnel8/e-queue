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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	BarChart3,
	TrendingUp,
	Star,
	MessageSquare,
	Filter,
	Search,
	Calendar,
	User,
	Edit,
	Trash2,
} from "lucide-react";
import QRCode from "react-qr-code";

interface EvaluationForm {
	id: string;
	title: string;
	description: string;
	office: string;
	services: string[];
	questions: {
		id: string;
		question: string;
		type: "rating" | "text" | "yes_no" | "radio" | "checkbox";
		required: boolean;
		choices?: string[];
	}[];
	createdAt: string;
	status: "active" | "draft" | "archived";
	qrCode?: string;
}

interface EvaluationResponse {
	id: string;
	formId: string;
	customerName: string;
	customerEmail: string;
	service: string;
	staffMember: string;
	submittedAt: string;
	responses: {
		questionId: string;
		question: string;
		answer: string | number;
		type: "rating" | "text" | "yes_no" | "radio" | "checkbox";
	}[];
	overallRating: number;
	comments: string;
}

export default function EvaluationPage() {
	const [evaluationForms, setEvaluationForms] = useState<EvaluationForm[]>([]);
	const [evaluationResponses, setEvaluationResponses] = useState<
		EvaluationResponse[]
	>([]);

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [showQRModal, setShowQRModal] = useState(false);
	const [selectedForm, setSelectedForm] = useState<EvaluationForm | null>(null);
	const [formToDelete, setFormToDelete] = useState<EvaluationForm | null>(null);
	const [formToPreview, setFormToPreview] = useState<EvaluationForm | null>(
		null
	);
	const [mounted, setMounted] = useState(false);
	const [activeTab, setActiveTab] = useState("forms");
	const [searchTerm, setSearchTerm] = useState("");
	const [filterService, setFilterService] = useState("all");
	const [filterDate, setFilterDate] = useState("all");
	const [selectedFormForAnalytics, setSelectedFormForAnalytics] =
		useState<string>("all");

	// Current office admin info (would come from auth context in real app)
	const currentAdmin = {
		office: "Registrar Office",
		name: "Office Administrator",
	};

	// Available services for this office
	const availableServices = [
		"Transcript Request",
		"Certificate Issuance",
		"Enrollment",
		"Grade Verification",
		"Document Authentication",
		"Academic Records",
	];

	// Form creation/editing state
	const [newForm, setNewForm] = useState({
		title: "",
		description: "",
		services: ["All Services"] as string[],
		questions: [] as any[],
	});
	const [editingForm, setEditingForm] = useState<EvaluationForm | null>(null);

	// Official CSM Form Template
	const officialCSMForm = {
		title: "Client Satisfaction Measurement (CSM)",
		description:
			"Official government evaluation form to track customer experience and service quality",
		questions: [
			// Client Information
			{
				id: "client_type",
				question: "Client Type",
				type: "radio" as const,
				required: true,
				choices: [
					"Citizen",
					"Business",
					"Government (Employee or another agency)",
				],
			},
			{
				id: "sex",
				question: "Sex",
				type: "radio" as const,
				required: true,
				choices: ["Male", "Female"],
			},
			{
				id: "age",
				question: "Age",
				type: "text" as const,
				required: false,
			},
			{
				id: "region",
				question: "Region of residence",
				type: "text" as const,
				required: false,
			},
			{
				id: "service_availed",
				question: "Service Availed",
				type: "text" as const,
				required: true,
			},
			// Citizen's Charter Questions
			{
				id: "cc1",
				question:
					"Which of the following best describes your awareness of a Citizen's Charter (CC)?",
				type: "radio" as const,
				required: true,
				choices: [
					"I know what a CC is and I saw this office's CC",
					"I know what a CC is but I did not see this office's CC",
					"I learned of the CC only when I saw this office's CC",
					"I do not know what a CC is and I did not see one in this office",
				],
			},
			{
				id: "cc2",
				question:
					"If aware of CC, would you say that the CC of this office was...?",
				type: "radio" as const,
				required: true,
				choices: [
					"Easy to see",
					"Somewhat easy to see",
					"Difficult to see",
					"Not visible at all",
					"N/A",
				],
			},
			{
				id: "cc3",
				question:
					"If aware of CC, how much did the CC help you in your transaction?",
				type: "radio" as const,
				required: true,
				choices: ["Helped very much", "Somewhat helped", "Did not help", "N/A"],
			},
			// Service Quality Dimensions (SQD) - Rating Scale Questions
			{
				id: "sqd0",
				question: "I am satisfied with the service that I availed.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd1",
				question: "I spent a reasonable amount of time for my transaction.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd2",
				question:
					"The office allowed the transaction's requirements and steps based on the information provided.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd3",
				question:
					"The steps (including payment) I needed to do for my transaction were easy and simple.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd4",
				question:
					"I easily found information about my transaction from the office or its website.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd5",
				question: "I paid reasonable amount of fees for my transaction.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd6",
				question:
					"I feel the office was fair to everyone, or 'walang palakasan', during my transaction.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd7",
				question:
					"I was treated courteously by the staff, and (if I asked for help) the staff was helpful.",
				type: "rating" as const,
				required: true,
			},
			{
				id: "sqd8",
				question:
					"I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me.",
				type: "rating" as const,
				required: true,
			},
			// Suggestions
			{
				id: "suggestions",
				question:
					"Suggestions on how we can further improve our services (optional)",
				type: "text" as const,
				required: false,
			},
		],
	};

	useEffect(() => {
		setMounted(true);
		loadEvaluationForms();
		loadEvaluationResponses();
	}, []);

	const loadEvaluationForms = () => {
		// In a real app, this would fetch from an API
		// Create the official CSM form by default
		const defaultCSMForm: EvaluationForm = {
			id: "eval-csm-default",
			title: officialCSMForm.title,
			description: officialCSMForm.description,
			office: currentAdmin.office,
			services: ["All Services"],
			questions: officialCSMForm.questions,
			createdAt: new Date().toISOString(),
			status: "active",
		};
		setEvaluationForms([defaultCSMForm]);
	};

	const loadEvaluationResponses = () => {
		// In a real app, this would fetch from an API
		// Add some sample responses for testing the delete warning
		const sampleResponses: EvaluationResponse[] = [
			{
				id: "resp-1",
				formId: "eval-csm-default",
				customerName: "John Doe",
				customerEmail: "john.doe@email.com",
				service: "Transcript Request",
				staffMember: "Maria Santos",
				submittedAt: new Date(
					Date.now() - 2 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "sqd0",
						question: "I am satisfied with the service that I availed.",
						answer: 5,
						type: "rating",
					},
					{
						questionId: "sqd1",
						question: "I spent a reasonable amount of time for my transaction.",
						answer: 4,
						type: "rating",
					},
					{
						questionId: "client_type",
						question: "Client Type",
						answer: "Citizen",
						type: "radio",
					},
				],
				overallRating: 4.5,
				comments: "Very efficient service. Staff was helpful and professional.",
			},
			{
				id: "resp-2",
				formId: "eval-csm-default",
				customerName: "Jane Smith",
				customerEmail: "jane.smith@email.com",
				service: "Certificate Issuance",
				staffMember: "Pedro Cruz",
				submittedAt: new Date(
					Date.now() - 1 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "sqd0",
						question: "I am satisfied with the service that I availed.",
						answer: 3,
						type: "rating",
					},
					{
						questionId: "sqd1",
						question: "I spent a reasonable amount of time for my transaction.",
						answer: 2,
						type: "rating",
					},
					{
						questionId: "client_type",
						question: "Client Type",
						answer: "Business",
						type: "radio",
					},
				],
				overallRating: 2.5,
				comments:
					"The process took longer than expected, but the staff was courteous.",
			},
		];
		setEvaluationResponses(sampleResponses);
	};

	// Filtered responses based on search and filters
	const filteredResponses = evaluationResponses.filter((response) => {
		const matchesSearch =
			response.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			response.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
			response.staffMember.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesService =
			filterService === "all" || response.service === filterService;

		const matchesDate =
			filterDate === "all" ||
			(filterDate === "today" &&
				new Date(response.submittedAt).toDateString() ===
					new Date().toDateString()) ||
			(filterDate === "week" &&
				new Date(response.submittedAt) >
					new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
			(filterDate === "month" &&
				new Date(response.submittedAt) >
					new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

		return matchesSearch && matchesService && matchesDate;
	});

	// Calculate analytics per form
	const getFormAnalytics = (formId: string) => {
		const formResponses = evaluationResponses.filter(
			(r) => r.formId === formId
		);
		const form = evaluationForms.find((f) => f.id === formId);

		if (!form || formResponses.length === 0) {
			return {
				totalResponses: 0,
				averageRating: "0.0",
				satisfactionRate: 0,
				questionAnalytics: {},
				recentResponses: [],
				hasRatingQuestions:
					form?.questions.some((q) => q.type === "rating") || false,
			};
		}

		const averageRating =
			formResponses.length > 0
				? (
						formResponses.reduce((sum, r) => sum + r.overallRating, 0) /
						formResponses.length
				  ).toFixed(1)
				: "0.0";

		const satisfactionRate =
			formResponses.length > 0
				? Math.round(
						(formResponses.filter((r) => r.overallRating >= 4).length /
							formResponses.length) *
							100
				  )
				: 0;

		// Question-specific analytics
		const questionAnalytics: any = {};
		form.questions.forEach((question) => {
			const questionResponses = formResponses.flatMap((r) =>
				r.responses.filter((resp) => resp.questionId === question.id)
			);

			if (question.type === "rating") {
				const ratings = questionResponses.map((r) => r.answer as number);
				questionAnalytics[question.id] = {
					type: "rating",
					average:
						ratings.length > 0
							? (
									ratings.reduce((sum, r) => sum + r, 0) / ratings.length
							  ).toFixed(1)
							: "0.0",
					total: ratings.length,
					distribution: {
						1: ratings.filter((r) => r === 1).length,
						2: ratings.filter((r) => r === 2).length,
						3: ratings.filter((r) => r === 3).length,
						4: ratings.filter((r) => r === 4).length,
						5: ratings.filter((r) => r === 5).length,
					},
				};
			} else if (question.type === "yes_no") {
				const yesCount = questionResponses.filter(
					(r) => r.answer === "Yes"
				).length;
				const noCount = questionResponses.filter(
					(r) => r.answer === "No"
				).length;
				questionAnalytics[question.id] = {
					type: "yes_no",
					yes: yesCount,
					no: noCount,
					total: questionResponses.length,
					yesPercentage:
						questionResponses.length > 0
							? Math.round((yesCount / questionResponses.length) * 100)
							: 0,
					noPercentage:
						questionResponses.length > 0
							? Math.round((noCount / questionResponses.length) * 100)
							: 0,
				};
			} else if (question.type === "radio") {
				const choiceCounts: { [key: string]: number } = {};
				questionResponses.forEach((r) => {
					const answer = r.answer as string;
					choiceCounts[answer] = (choiceCounts[answer] || 0) + 1;
				});
				questionAnalytics[question.id] = {
					type: "radio",
					choices: choiceCounts,
					total: questionResponses.length,
				};
			} else if (question.type === "checkbox") {
				const choiceCounts: { [key: string]: number } = {};
				questionResponses.forEach((r) => {
					const answers = (r.answer as string).split(", ");
					answers.forEach((answer) => {
						choiceCounts[answer] = (choiceCounts[answer] || 0) + 1;
					});
				});
				questionAnalytics[question.id] = {
					type: "checkbox",
					choices: choiceCounts,
					total: questionResponses.length,
				};
			} else if (question.type === "text") {
				const textResponses = questionResponses.map((r) => r.answer as string);
				const averageLength =
					textResponses.length > 0
						? Math.round(
								textResponses.reduce((sum, text) => sum + text.length, 0) /
									textResponses.length
						  )
						: 0;
				questionAnalytics[question.id] = {
					type: "text",
					total: questionResponses.length,
					averageLength,
					sampleResponses: textResponses.slice(0, 3), // Show first 3 responses
				};
			}
		});

		return {
			totalResponses: formResponses.length,
			averageRating,
			satisfactionRate,
			questionAnalytics,
			recentResponses: formResponses.slice(0, 5), // Show last 5 responses
			hasRatingQuestions: form.questions.some((q) => q.type === "rating"),
		};
	};

	// Calculate overall analytics
	const totalResponses = evaluationResponses.length;
	const averageRating =
		evaluationResponses.length > 0
			? (
					evaluationResponses.reduce((sum, r) => sum + r.overallRating, 0) /
					evaluationResponses.length
			  ).toFixed(1)
			: "0.0";
	const satisfactionRate =
		evaluationResponses.length > 0
			? Math.round(
					(evaluationResponses.filter((r) => r.overallRating >= 4).length /
						evaluationResponses.length) *
						100
			  )
			: 0;

	// Calculate analytics for non-rating question types
	const getQuestionTypeAnalytics = () => {
		const questionTypes = {
			rating: 0,
			text: 0,
			yes_no: 0,
			radio: 0,
			checkbox: 0,
		};

		evaluationResponses.forEach((response) => {
			response.responses.forEach((resp) => {
				questionTypes[resp.type as keyof typeof questionTypes]++;
			});
		});

		return questionTypes;
	};

	const questionTypeCounts = getQuestionTypeAnalytics();

	// Calculate Yes/No analytics
	const getYesNoAnalytics = () => {
		const yesNoResponses = evaluationResponses.flatMap((response) =>
			response.responses.filter((resp) => resp.type === "yes_no")
		);

		const yesCount = yesNoResponses.filter(
			(resp) => resp.answer === "Yes"
		).length;
		const noCount = yesNoResponses.filter(
			(resp) => resp.answer === "No"
		).length;
		const totalYesNo = yesNoResponses.length;

		return {
			yesCount,
			noCount,
			totalYesNo,
			yesPercentage:
				totalYesNo > 0 ? Math.round((yesCount / totalYesNo) * 100) : 0,
			noPercentage:
				totalYesNo > 0 ? Math.round((noCount / totalYesNo) * 100) : 0,
		};
	};

	const yesNoAnalytics = getYesNoAnalytics();

	// Calculate Radio button analytics
	const getRadioAnalytics = () => {
		const radioResponses = evaluationResponses.flatMap((response) =>
			response.responses.filter((resp) => resp.type === "radio")
		);

		const radioCounts: { [key: string]: number } = {};
		radioResponses.forEach((resp) => {
			const answer = resp.answer as string;
			radioCounts[answer] = (radioCounts[answer] || 0) + 1;
		});

		return {
			totalRadio: radioResponses.length,
			radioCounts,
		};
	};

	const radioAnalytics = getRadioAnalytics();

	// Calculate Checkbox analytics
	const getCheckboxAnalytics = () => {
		const checkboxResponses = evaluationResponses.flatMap((response) =>
			response.responses.filter((resp) => resp.type === "checkbox")
		);

		const checkboxCounts: { [key: string]: number } = {};
		checkboxResponses.forEach((resp) => {
			const answers = (resp.answer as string).split(", ");
			answers.forEach((answer) => {
				checkboxCounts[answer] = (checkboxCounts[answer] || 0) + 1;
			});
		});

		return {
			totalCheckbox: checkboxResponses.length,
			checkboxCounts,
		};
	};

	const checkboxAnalytics = getCheckboxAnalytics();

	// Calculate Text response analytics
	const getTextAnalytics = () => {
		const textResponses = evaluationResponses.flatMap((response) =>
			response.responses.filter((resp) => resp.type === "text")
		);

		const averageTextLength =
			textResponses.length > 0
				? Math.round(
						textResponses.reduce(
							(sum, resp) => sum + (resp.answer as string).length,
							0
						) / textResponses.length
				  )
				: 0;

		return {
			totalText: textResponses.length,
			averageTextLength,
			textResponses: textResponses.slice(0, 5).map((resp) => ({
				...resp,
				answer: resp.answer as string,
			})), // Show first 5 text responses with proper typing
		};
	};

	const textAnalytics = getTextAnalytics();

	// Calculate analytics for forms with no rating questions
	const getNonRatingFormAnalytics = () => {
		const nonRatingForms = evaluationForms.filter(
			(form) => !form.questions.some((q) => q.type === "rating")
		);

		const nonRatingResponses = evaluationResponses.filter((response) =>
			nonRatingForms.some((form) => form.id === response.formId)
		);

		return {
			totalNonRatingForms: nonRatingForms.length,
			totalNonRatingResponses: nonRatingResponses.length,
			nonRatingForms: nonRatingForms,
			nonRatingResponses: nonRatingResponses,
		};
	};

	const nonRatingAnalytics = getNonRatingFormAnalytics();

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
			choices: [] as string[],
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

	const addChoice = (questionIndex: number) => {
		const updatedQuestions = [...newForm.questions];
		updatedQuestions[questionIndex].choices = [
			...updatedQuestions[questionIndex].choices,
			"",
		];
		setNewForm({ ...newForm, questions: updatedQuestions });
	};

	const updateChoice = (
		questionIndex: number,
		choiceIndex: number,
		value: string
	) => {
		const updatedQuestions = [...newForm.questions];
		updatedQuestions[questionIndex].choices[choiceIndex] = value;
		setNewForm({ ...newForm, questions: updatedQuestions });
	};

	const removeChoice = (questionIndex: number, choiceIndex: number) => {
		const updatedQuestions = [...newForm.questions];
		updatedQuestions[questionIndex].choices = updatedQuestions[
			questionIndex
		].choices.filter((_: string, i: number) => i !== choiceIndex);
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

		// Validate that radio and checkbox questions have choices
		for (const question of newForm.questions) {
			if (
				(question.type === "radio" || question.type === "checkbox") &&
				(!question.choices || question.choices.length === 0)
			) {
				alert(
					`Question "${question.question}" requires answer choices for ${question.type} type.`
				);
				return;
			}
		}

		if (editingForm) {
			// Update existing form
			const updatedForm: EvaluationForm = {
				...editingForm,
				title: newForm.title,
				description: newForm.description,
				questions: newForm.questions,
			};

			setEvaluationForms(
				evaluationForms.map((form) =>
					form.id === editingForm.id ? updatedForm : form
				)
			);
			setEditingForm(null);
			setShowEditForm(false);
			alert("Evaluation form updated successfully!");
		} else {
			// Create new form
			const form: EvaluationForm = {
				id: `eval-${Date.now()}`,
				title: newForm.title,
				description: newForm.description,
				office: currentAdmin.office,
				services: ["All Services"],
				questions: newForm.questions,
				createdAt: new Date().toISOString(),
				status: "draft",
			};

			setEvaluationForms([...evaluationForms, form]);
			alert("Evaluation form created successfully!");
		}

		// Reset form
		setNewForm({
			title: "",
			description: "",
			services: ["All Services"],
			questions: [],
		});
		setShowCreateForm(false);
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

	const editForm = (form: EvaluationForm) => {
		setEditingForm(form);
		setNewForm({
			title: form.title,
			description: form.description,
			services: form.services,
			questions: form.questions,
		});
		setShowEditForm(true);
	};

	const deleteForm = (form: EvaluationForm) => {
		setFormToDelete(form);
		setShowDeleteModal(true);
	};

	const confirmDeleteForm = () => {
		if (!formToDelete) return;

		// Remove the form
		setEvaluationForms(
			evaluationForms.filter((form) => form.id !== formToDelete.id)
		);

		// Also remove any responses for this form
		setEvaluationResponses(
			evaluationResponses.filter(
				(response) => response.formId !== formToDelete.id
			)
		);

		setFormToDelete(null);
		setShowDeleteModal(false);
		alert("Evaluation form deleted successfully!");
	};

	const cancelDelete = () => {
		setFormToDelete(null);
		setShowDeleteModal(false);
	};

	const resetForm = () => {
		setNewForm({
			title: "",
			description: "",
			services: ["All Services"],
			questions: [],
		});
		setEditingForm(null);
		setShowCreateForm(false);
		setShowEditForm(false);
	};

	const previewForm = (form: EvaluationForm) => {
		setFormToPreview(form);
		setShowPreviewModal(true);
	};

	if (!mounted) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div>
			<div className="space-y-6">
				{/* Header with Create Button */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Evaluation Management
						</h1>
						<p className="text-gray-600">
							Create evaluation forms and analyze customer feedback results
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

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="forms" className="flex items-center gap-2">
							<FileText className="w-4 h-4" />
							Evaluation Forms
						</TabsTrigger>
						<TabsTrigger value="results" className="flex items-center gap-2">
							<BarChart3 className="w-4 h-4" />
							Results & Analytics
						</TabsTrigger>
					</TabsList>

					{/* Forms Tab */}
					<TabsContent value="forms" className="space-y-6">
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
															{mounted
																? new Date(form.createdAt).toLocaleDateString()
																: form.createdAt}
														</p>
													</div>
													<div className="flex gap-2">
														<Button
															onClick={() => previewForm(form)}
															variant="outline"
															size="sm"
															className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
														>
															<Eye className="w-4 h-4 mr-2" />
															Preview
														</Button>
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
															onClick={() => editForm(form)}
															variant="outline"
															size="sm"
														>
															<Edit className="w-4 h-4 mr-2" />
															Edit
														</Button>
														<Button
															onClick={() => toggleFormStatus(form.id)}
															variant="outline"
															size="sm"
														>
															{form.status === "active"
																? "Deactivate"
																: "Activate"}
														</Button>
														<Button
															onClick={() => deleteForm(form)}
															variant="outline"
															size="sm"
															className="text-red-600 hover:text-red-700 hover:bg-red-50"
															disabled={form.status === "active"}
															title={
																form.status === "active"
																	? "Cannot delete active forms"
																	: "Delete form"
															}
														>
															<Trash2 className="w-4 h-4 mr-2" />
															Delete
														</Button>
													</div>
												</div>
											</div>
										))
									) : (
										<div className="text-center py-8">
											<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
											<p className="text-gray-500">
												No evaluation forms created yet
											</p>
											<Button
												onClick={() => setShowCreateForm(true)}
												className="mt-4"
											>
												Create Additional Form
											</Button>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Results Tab */}
					<TabsContent value="results" className="space-y-6">
						{/* Results Stats Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600">Total Responses</p>
											<p className="text-2xl font-bold text-[#071952]">
												{totalResponses}
											</p>
										</div>
										<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
											<MessageSquare className="w-5 h-5 text-blue-600" />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600">Average Rating</p>
											<p className="text-2xl font-bold text-[#071952]">
												{averageRating}
											</p>
										</div>
										<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
											<Star className="w-5 h-5 text-yellow-600" />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600">Satisfaction Rate</p>
											<p className="text-2xl font-bold text-[#071952]">
												{satisfactionRate}%
											</p>
										</div>
										<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
											<TrendingUp className="w-5 h-5 text-green-600" />
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
										<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
											<FileText className="w-5 h-5 text-purple-600" />
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Individual Form Analytics */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="w-5 h-5 text-blue-600" />
									Individual Form Analytics
								</CardTitle>
								<CardDescription>
									Detailed analytics for each evaluation form
								</CardDescription>
							</CardHeader>
							<CardContent>
								{/* Form Selector */}
								<div className="mb-6">
									<Label
										htmlFor="form-selector"
										className="text-sm font-medium mb-2 block"
									>
										Select Form to View Analytics
									</Label>
									<Select
										value={selectedFormForAnalytics}
										onValueChange={setSelectedFormForAnalytics}
									>
										<SelectTrigger className="w-full md:w-80">
											<SelectValue placeholder="Choose a form to analyze" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Forms Overview</SelectItem>
											{evaluationForms.map((form) => (
												<SelectItem key={form.id} value={form.id}>
													{form.title} (
													{getFormAnalytics(form.id).totalResponses} responses)
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-6">
									{selectedFormForAnalytics === "all" ? (
										// Show overview of all forms
										<div className="space-y-4">
											<h3 className="text-lg font-semibold">
												All Forms Overview
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{evaluationForms.map((form) => {
													const analytics = getFormAnalytics(form.id);
													return (
														<div
															key={form.id}
															className="border rounded-lg p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors"
															onClick={() =>
																setSelectedFormForAnalytics(form.id)
															}
														>
															<div className="flex items-center justify-between">
																<h4 className="font-medium text-sm">
																	{form.title}
																</h4>
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
															<div className="grid grid-cols-2 gap-2 text-xs">
																<div>
																	<p className="text-gray-500">Responses</p>
																	<p className="font-semibold">
																		{analytics.totalResponses}
																	</p>
																</div>
																{analytics.hasRatingQuestions && (
																	<div>
																		<p className="text-gray-500">Avg Rating</p>
																		<p className="font-semibold">
																			{analytics.averageRating}/5
																		</p>
																	</div>
																)}
																<div>
																	<p className="text-gray-500">Questions</p>
																	<p className="font-semibold">
																		{form.questions.length}
																	</p>
																</div>
																<div>
																	<p className="text-gray-500">Services</p>
																	<p className="font-semibold">
																		{form.services.length}
																	</p>
																</div>
															</div>
															<div className="text-xs text-gray-500">
																Click to view detailed analytics
															</div>
														</div>
													);
												})}
											</div>
										</div>
									) : (
										// Show detailed analytics for selected form
										(() => {
											const form = evaluationForms.find(
												(f) => f.id === selectedFormForAnalytics
											);
											if (!form) return null;

											const analytics = getFormAnalytics(form.id);
											return (
												<div
													key={form.id}
													className="border rounded-lg p-6 space-y-4"
												>
													<div className="flex items-center justify-between">
														<div>
															<h3 className="text-lg font-semibold">
																{form.title}
															</h3>
															<p className="text-sm text-gray-600">
																{form.description}
															</p>
														</div>
														<div className="flex items-center gap-2">
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
															<Button
																onClick={() =>
																	setSelectedFormForAnalytics("all")
																}
																variant="outline"
																size="sm"
															>
																← Back to Overview
															</Button>
														</div>
													</div>

													{/* Form Overview Stats */}
													<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
														<div className="bg-blue-50 p-4 rounded-lg">
															<p className="text-sm text-blue-600 font-medium">
																Total Responses
															</p>
															<p className="text-2xl font-bold text-blue-700">
																{analytics.totalResponses}
															</p>
														</div>
														{analytics.hasRatingQuestions && (
															<>
																<div className="bg-yellow-50 p-4 rounded-lg">
																	<p className="text-sm text-yellow-600 font-medium">
																		Average Rating
																	</p>
																	<p className="text-2xl font-bold text-yellow-700">
																		{analytics.averageRating}/5
																	</p>
																</div>
																<div className="bg-green-50 p-4 rounded-lg">
																	<p className="text-sm text-green-600 font-medium">
																		Satisfaction Rate
																	</p>
																	<p className="text-2xl font-bold text-green-700">
																		{analytics.satisfactionRate}%
																	</p>
																</div>
															</>
														)}
														<div className="bg-purple-50 p-4 rounded-lg">
															<p className="text-sm text-purple-600 font-medium">
																Questions
															</p>
															<p className="text-2xl font-bold text-purple-700">
																{form.questions.length}
															</p>
														</div>
													</div>

													{/* Question-by-Question Analytics */}
													{analytics.totalResponses > 0 && (
														<div className="space-y-4">
															<h4 className="text-md font-semibold">
																Question Analytics
															</h4>
															<div className="space-y-4">
																{form.questions.map((question) => {
																	const questionAnalytics =
																		analytics.questionAnalytics[question.id];
																	if (!questionAnalytics) return null;

																	return (
																		<div
																			key={question.id}
																			className="border rounded-lg p-4 space-y-3"
																		>
																			<div className="flex items-center justify-between">
																				<h5 className="font-medium">
																					{question.question}
																				</h5>
																				<Badge
																					variant="outline"
																					className="text-xs"
																				>
																					{question.type}
																				</Badge>
																			</div>

																			{/* Rating Question Analytics */}
																			{questionAnalytics.type === "rating" && (
																				<div className="space-y-3">
																					<div className="flex items-center justify-between">
																						<span className="text-sm">
																							Average Rating:{" "}
																							{questionAnalytics.average}/5
																						</span>
																						<span className="text-sm text-gray-500">
																							{questionAnalytics.total}{" "}
																							responses
																						</span>
																					</div>
																					<div className="space-y-2">
																						{[5, 4, 3, 2, 1].map((rating) => (
																							<div
																								key={rating}
																								className="flex items-center gap-2"
																							>
																								<span className="text-sm w-4">
																									{rating}
																								</span>
																								<div className="flex-1 bg-gray-200 rounded-full h-2">
																									<div
																										className="bg-blue-600 h-2 rounded-full"
																										style={{
																											width: `${
																												questionAnalytics.total >
																												0
																													? (questionAnalytics
																															.distribution[
																															rating
																													  ] /
																															questionAnalytics.total) *
																													  100
																													: 0
																											}%`,
																										}}
																									></div>
																								</div>
																								<span className="text-xs text-gray-500 w-8">
																									{
																										questionAnalytics
																											.distribution[rating]
																									}
																								</span>
																							</div>
																						))}
																					</div>
																				</div>
																			)}

																			{/* Yes/No Question Analytics */}
																			{questionAnalytics.type === "yes_no" && (
																				<div className="grid grid-cols-2 gap-4">
																					<div className="bg-green-50 p-3 rounded-lg">
																						<div className="flex items-center justify-between">
																							<span className="text-sm font-medium text-green-800">
																								Yes
																							</span>
																							<span className="text-lg font-bold text-green-700">
																								{questionAnalytics.yes}
																							</span>
																						</div>
																						<div className="mt-2">
																							<div className="w-full bg-green-200 rounded-full h-2">
																								<div
																									className="bg-green-600 h-2 rounded-full"
																									style={{
																										width: `${questionAnalytics.yesPercentage}%`,
																									}}
																								></div>
																							</div>
																							<p className="text-xs text-green-600 mt-1">
																								{
																									questionAnalytics.yesPercentage
																								}
																								%
																							</p>
																						</div>
																					</div>
																					<div className="bg-red-50 p-3 rounded-lg">
																						<div className="flex items-center justify-between">
																							<span className="text-sm font-medium text-red-800">
																								No
																							</span>
																							<span className="text-lg font-bold text-red-700">
																								{questionAnalytics.no}
																							</span>
																						</div>
																						<div className="mt-2">
																							<div className="w-full bg-red-200 rounded-full h-2">
																								<div
																									className="bg-red-600 h-2 rounded-full"
																									style={{
																										width: `${questionAnalytics.noPercentage}%`,
																									}}
																								></div>
																							</div>
																							<p className="text-xs text-red-600 mt-1">
																								{questionAnalytics.noPercentage}
																								%
																							</p>
																						</div>
																					</div>
																				</div>
																			)}

																			{/* Radio Question Analytics */}
																			{questionAnalytics.type === "radio" && (
																				<div className="space-y-2">
																					{Object.entries(
																						questionAnalytics.choices
																					).map(([choice, count]) => (
																						<div
																							key={choice}
																							className="flex items-center justify-between p-2 bg-gray-50 rounded"
																						>
																							<span className="text-sm">
																								{choice}
																							</span>
																							<div className="flex items-center gap-2">
																								<span className="text-sm text-gray-600">
																									{count as number} responses
																								</span>
																								<Badge
																									variant="outline"
																									className="text-xs"
																								>
																									{Math.round(
																										((count as number) /
																											questionAnalytics.total) *
																											100
																									)}
																									%
																								</Badge>
																							</div>
																						</div>
																					))}
																				</div>
																			)}

																			{/* Checkbox Question Analytics */}
																			{questionAnalytics.type ===
																				"checkbox" && (
																				<div className="space-y-2">
																					{Object.entries(
																						questionAnalytics.choices
																					).map(([choice, count]) => (
																						<div
																							key={choice}
																							className="flex items-center justify-between p-2 bg-gray-50 rounded"
																						>
																							<span className="text-sm">
																								{choice}
																							</span>
																							<div className="flex items-center gap-2">
																								<span className="text-sm text-gray-600">
																									{count as number} selections
																								</span>
																								<Badge
																									variant="outline"
																									className="text-xs"
																								>
																									{Math.round(
																										((count as number) /
																											questionAnalytics.total) *
																											100
																									)}
																									%
																								</Badge>
																							</div>
																						</div>
																					))}
																				</div>
																			)}

																			{/* Text Question Analytics */}
																			{questionAnalytics.type === "text" && (
																				<div className="space-y-3">
																					<div className="flex items-center justify-between">
																						<span className="text-sm">
																							Total Responses:{" "}
																							{questionAnalytics.total}
																						</span>
																						<span className="text-sm text-gray-500">
																							Avg. Length:{" "}
																							{questionAnalytics.averageLength}{" "}
																							chars
																						</span>
																					</div>
																					{questionAnalytics.sampleResponses
																						.length > 0 && (
																						<div>
																							<p className="text-sm font-medium mb-2">
																								Sample Responses:
																							</p>
																							<div className="space-y-2">
																								{questionAnalytics.sampleResponses.map(
																									(
																										response: string,
																										index: number
																									) => (
																										<div
																											key={index}
																											className="bg-gray-50 p-2 rounded text-sm"
																										>
																											"{response}"
																										</div>
																									)
																								)}
																							</div>
																						</div>
																					)}
																				</div>
																			)}
																		</div>
																	);
																})}
															</div>
														</div>
													)}

													{/* Recent Responses */}
													{analytics.recentResponses.length > 0 && (
														<div>
															<h4 className="text-md font-semibold mb-3">
																Recent Responses
															</h4>
															<div className="space-y-2">
																{analytics.recentResponses.map((response) => (
																	<div
																		key={response.id}
																		className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
																	>
																		<div>
																			<p className="font-medium text-sm">
																				{response.customerName}
																			</p>
																			<p className="text-xs text-gray-500">
																				{response.service}
																			</p>
																		</div>
																		<div className="flex items-center gap-2">
																			{analytics.hasRatingQuestions && (
																				<div className="flex items-center gap-1">
																					<Star className="w-3 h-3 text-yellow-500 fill-current" />
																					<span className="text-sm">
																						{response.overallRating}/5
																					</span>
																				</div>
																			)}
																			<span className="text-xs text-gray-500">
																				{mounted
																					? new Date(
																							response.submittedAt
																					  ).toLocaleDateString()
																					: response.submittedAt}
																			</span>
																		</div>
																	</div>
																))}
															</div>
														</div>
													)}

													{analytics.totalResponses === 0 && (
														<div className="text-center py-8 text-gray-500">
															<MessageSquare className="w-8 h-8 mx-auto mb-2" />
															<p>No responses yet for this form</p>
														</div>
													)}
												</div>
											);
										})()
									)}
								</div>
							</CardContent>
						</Card>

						{/* Non-Rating Question Analytics */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="w-5 h-5 text-blue-600" />
									Non-Rating Question Analytics
								</CardTitle>
								<CardDescription>
									Analytics for forms with no rating questions
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
									<Card>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm text-gray-600">
														Non-Rating Forms
													</p>
													<p className="text-2xl font-bold text-[#071952]">
														{nonRatingAnalytics.totalNonRatingForms}
													</p>
												</div>
												<div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
													<FileText className="w-5 h-5 text-indigo-600" />
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm text-gray-600">
														Non-Rating Responses
													</p>
													<p className="text-2xl font-bold text-[#071952]">
														{nonRatingAnalytics.totalNonRatingResponses}
													</p>
												</div>
												<div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
													<MessageSquare className="w-5 h-5 text-pink-600" />
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm text-gray-600">
														Yes/No Questions
													</p>
													<p className="text-2xl font-bold text-[#071952]">
														{questionTypeCounts.yes_no}
													</p>
												</div>
												<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
													<CheckCircle className="w-5 h-5 text-orange-600" />
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm text-gray-600">
														Text Responses
													</p>
													<p className="text-2xl font-bold text-[#071952]">
														{questionTypeCounts.text}
													</p>
												</div>
												<div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
													<FileText className="w-5 h-5 text-teal-600" />
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Yes/No Analytics */}
								{yesNoAnalytics.totalYesNo > 0 && (
									<div className="mb-6">
										<h3 className="text-lg font-semibold mb-3">
											Yes/No Question Results
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="bg-green-50 p-4 rounded-lg">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-green-800">
														Yes Responses
													</span>
													<span className="text-2xl font-bold text-green-600">
														{yesNoAnalytics.yesCount}
													</span>
												</div>
												<div className="mt-2">
													<div className="w-full bg-green-200 rounded-full h-2">
														<div
															className="bg-green-600 h-2 rounded-full"
															style={{
																width: `${yesNoAnalytics.yesPercentage}%`,
															}}
														></div>
													</div>
													<p className="text-xs text-green-600 mt-1">
														{yesNoAnalytics.yesPercentage}%
													</p>
												</div>
											</div>
											<div className="bg-red-50 p-4 rounded-lg">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-red-800">
														No Responses
													</span>
													<span className="text-2xl font-bold text-red-600">
														{yesNoAnalytics.noCount}
													</span>
												</div>
												<div className="mt-2">
													<div className="w-full bg-red-200 rounded-full h-2">
														<div
															className="bg-red-600 h-2 rounded-full"
															style={{
																width: `${yesNoAnalytics.noPercentage}%`,
															}}
														></div>
													</div>
													<p className="text-xs text-red-600 mt-1">
														{yesNoAnalytics.noPercentage}%
													</p>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Radio Button Analytics */}
								{radioAnalytics.totalRadio > 0 && (
									<div className="mb-6">
										<h3 className="text-lg font-semibold mb-3">
											Radio Button Question Results
										</h3>
										<div className="space-y-3">
											{Object.entries(radioAnalytics.radioCounts).map(
												([choice, count]) => (
													<div
														key={choice}
														className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
													>
														<span className="font-medium">{choice}</span>
														<div className="flex items-center gap-2">
															<span className="text-sm text-gray-600">
																{count} responses
															</span>
															<Badge variant="outline">
																{Math.round(
																	(count / radioAnalytics.totalRadio) * 100
																)}
																%
															</Badge>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}

								{/* Checkbox Analytics */}
								{checkboxAnalytics.totalCheckbox > 0 && (
									<div className="mb-6">
										<h3 className="text-lg font-semibold mb-3">
											Checkbox Question Results
										</h3>
										<div className="space-y-3">
											{Object.entries(checkboxAnalytics.checkboxCounts).map(
												([choice, count]) => (
													<div
														key={choice}
														className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
													>
														<span className="font-medium">{choice}</span>
														<div className="flex items-center gap-2">
															<span className="text-sm text-gray-600">
																{count} selections
															</span>
															<Badge variant="outline">
																{Math.round(
																	(count / checkboxAnalytics.totalCheckbox) *
																		100
																)}
																%
															</Badge>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}

								{/* Text Response Analytics */}
								{textAnalytics.totalText > 0 && (
									<div>
										<h3 className="text-lg font-semibold mb-3">
											Text Response Analytics
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
											<div className="bg-blue-50 p-4 rounded-lg">
												<span className="text-sm font-medium text-blue-800">
													Total Text Responses
												</span>
												<p className="text-2xl font-bold text-blue-600">
													{textAnalytics.totalText}
												</p>
											</div>
											<div className="bg-purple-50 p-4 rounded-lg">
												<span className="text-sm font-medium text-purple-800">
													Average Response Length
												</span>
												<p className="text-2xl font-bold text-purple-600">
													{textAnalytics.averageTextLength} characters
												</p>
											</div>
										</div>
										<div>
											<h4 className="text-md font-medium mb-2">
												Recent Text Responses
											</h4>
											<div className="space-y-2">
												{textAnalytics.textResponses.map((resp, index) => (
													<div
														key={index}
														className="bg-gray-50 p-3 rounded-lg"
													>
														<p className="text-sm text-gray-700">
															{resp.answer}
														</p>
														<p className="text-xs text-gray-500 mt-1">
															{resp.answer.length} characters
														</p>
													</div>
												))}
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Filters and Search */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Filter className="w-5 h-5 text-blue-600" />
									Filters & Search
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="relative">
										<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
										<Input
											placeholder="Search by name, service, or staff..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="pl-10"
										/>
									</div>
									<Select
										value={filterService}
										onValueChange={setFilterService}
									>
										<SelectTrigger>
											<SelectValue placeholder="Filter by service" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Services</SelectItem>
											{availableServices.map((service) => (
												<SelectItem key={service} value={service}>
													{service}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Select value={filterDate} onValueChange={setFilterDate}>
										<SelectTrigger>
											<SelectValue placeholder="Filter by date" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Time</SelectItem>
											<SelectItem value="today">Today</SelectItem>
											<SelectItem value="week">This Week</SelectItem>
											<SelectItem value="month">This Month</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						{/* Evaluation Results List */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="w-5 h-5 text-blue-600" />
									Evaluation Results
								</CardTitle>
								<CardDescription>
									Customer feedback and evaluation responses
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{filteredResponses.length > 0 ? (
										filteredResponses.map((response) => (
											<div
												key={response.id}
												className="border rounded-lg p-4 space-y-4"
											>
												<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
													<div className="space-y-3 flex-1">
														<div className="flex items-center gap-3">
															<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
																<User className="w-5 h-5 text-blue-600" />
															</div>
															<div>
																<h3 className="font-semibold text-lg">
																	{response.customerName}
																</h3>
																<p className="text-sm text-gray-500">
																	{response.customerEmail}
																</p>
															</div>
														</div>

														<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
															<div>
																<Label className="text-xs text-gray-500">
																	Service
																</Label>
																<p className="font-medium">
																	{response.service}
																</p>
															</div>
															<div>
																<Label className="text-xs text-gray-500">
																	Staff Member
																</Label>
																<p className="font-medium">
																	{response.staffMember}
																</p>
															</div>
															<div>
																<Label className="text-xs text-gray-500">
																	Overall Rating
																</Label>
																<div className="flex items-center gap-1">
																	<Star className="w-4 h-4 text-yellow-500 fill-current" />
																	<span className="font-medium">
																		{response.overallRating}/5
																	</span>
																</div>
															</div>
														</div>

														{/* Question Responses */}
														<div className="space-y-3">
															<Label className="text-sm font-medium">
																Responses:
															</Label>
															{response.responses.map((resp, index) => (
																<div
																	key={index}
																	className="bg-gray-50 p-3 rounded-lg"
																>
																	<p className="text-sm font-medium text-gray-700 mb-2">
																		{resp.question}
																	</p>
																	{resp.type === "rating" ? (
																		<div className="flex items-center gap-1">
																			<Star className="w-4 h-4 text-yellow-500 fill-current" />
																			<span>{resp.answer}/5</span>
																		</div>
																	) : resp.type === "yes_no" ? (
																		<Badge
																			variant={
																				resp.answer === "Yes"
																					? "default"
																					: "secondary"
																			}
																		>
																			{resp.answer}
																		</Badge>
																	) : (
																		<p className="text-sm text-gray-600">
																			{resp.answer}
																		</p>
																	)}
																</div>
															))}
														</div>

														{response.comments && (
															<div>
																<Label className="text-sm font-medium">
																	Additional Comments:
																</Label>
																<p className="text-sm text-gray-600 mt-1">
																	{response.comments}
																</p>
															</div>
														)}

														<div className="flex items-center gap-2 text-xs text-gray-500">
															<Calendar className="w-3 h-3" />
															Submitted{" "}
															{mounted
																? new Date(
																		response.submittedAt
																  ).toLocaleDateString()
																: response.submittedAt}{" "}
															at{" "}
															{mounted
																? new Date(
																		response.submittedAt
																  ).toLocaleTimeString()
																: "Loading..."}
														</div>
													</div>
												</div>
											</div>
										))
									) : (
										<div className="text-center py-8">
											<BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
											<p className="text-gray-500">
												{searchTerm ||
												filterService !== "all" ||
												filterDate !== "all"
													? "No results match your current filters"
													: "No evaluation responses yet"}
											</p>
											{(searchTerm ||
												filterService !== "all" ||
												filterDate !== "all") && (
												<Button
													onClick={() => {
														setSearchTerm("");
														setFilterService("all");
														setFilterDate("all");
													}}
													variant="outline"
													className="mt-4"
												>
													Clear Filters
												</Button>
											)}
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Create/Edit Form Modal */}
				{(showCreateForm || showEditForm) && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-6 space-y-6">
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold">
										{editingForm
											? "Edit Evaluation Form"
											: "Create Evaluation Form"}
									</h2>
									<Button onClick={resetForm} variant="outline" size="sm">
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
										<Label>Services</Label>
										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-sm text-gray-600">
												This evaluation form will be available for all services
												in {currentAdmin.office}.
											</p>
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
																	<SelectItem value="radio">Radio</SelectItem>
																	<SelectItem value="checkbox">
																		Checkbox
																	</SelectItem>
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

													{/* Answer Choices for Radio and Checkbox */}
													{(question.type === "radio" ||
														question.type === "checkbox") && (
														<div className="space-y-3">
															<div className="flex items-center justify-between">
																<Label className="text-xs">
																	Answer Choices
																</Label>
																<Button
																	onClick={() => addChoice(index)}
																	variant="outline"
																	size="sm"
																	type="button"
																>
																	<Plus className="w-3 h-3 mr-1" />
																	Add Choice
																</Button>
															</div>

															<div className="space-y-2">
																{question.choices?.map(
																	(choice: string, choiceIndex: number) => (
																		<div
																			key={choiceIndex}
																			className="flex items-center gap-2"
																		>
																			<div className="w-4 h-4">
																				{question.type === "radio" ? (
																					<div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
																				) : (
																					<div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
																				)}
																			</div>
																			<Input
																				value={choice}
																				onChange={(e) =>
																					updateChoice(
																						index,
																						choiceIndex,
																						e.target.value
																					)
																				}
																				placeholder={`Choice ${
																					choiceIndex + 1
																				}`}
																				className="flex-1"
																			/>
																			<Button
																				onClick={() =>
																					removeChoice(index, choiceIndex)
																				}
																				variant="outline"
																				size="sm"
																				type="button"
																			>
																				<X className="w-3 h-3" />
																			</Button>
																		</div>
																	)
																)}

																{(!question.choices ||
																	question.choices.length === 0) && (
																	<div className="text-center py-2 text-gray-500 text-xs">
																		No choices added yet. Click "Add Choice" to
																		get started.
																	</div>
																)}
															</div>
														</div>
													)}
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
										{editingForm ? "Update Form" : "Save Form"}
									</Button>
									<Button
										onClick={resetForm}
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
										<strong>Instructions:</strong> Print this QR code and place
										it where customers can easily scan it after receiving
										service. The QR code will direct them to the evaluation
										form.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Delete Confirmation Modal */}
				{showDeleteModal && formToDelete && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg max-w-md w-full p-6">
							<div className="text-center space-y-4">
								<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
									<Trash2 className="w-6 h-6 text-red-600" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Delete Evaluation Form
								</h3>
								<p className="text-gray-600">
									Are you sure you want to delete "{formToDelete.title}"?
								</p>

								{/* Check if form has responses */}
								{(() => {
									const formResponses = evaluationResponses.filter(
										(r) => r.formId === formToDelete.id
									);
									if (formResponses.length > 0) {
										return (
											<div className="bg-red-50 border border-red-200 rounded-lg p-4">
												<div className="flex items-start gap-3">
													<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
													<div className="text-left">
														<p className="text-sm font-medium text-red-800">
															Warning: This form has existing responses
														</p>
														<p className="text-sm text-red-700 mt-1">
															This form has {formResponses.length} response(s).
															Deleting it will permanently remove all associated
															responses and analytics data. This action cannot
															be undone.
														</p>
													</div>
												</div>
											</div>
										);
									}
									return null;
								})()}

								<div className="flex gap-3">
									<Button
										onClick={confirmDeleteForm}
										className="flex-1 bg-red-600 hover:bg-red-700"
									>
										<Trash2 className="w-4 h-4 mr-2" />
										Delete Form
									</Button>
									<Button
										onClick={cancelDelete}
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

				{/* Form Preview Modal */}
				{showPreviewModal && formToPreview && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-6 space-y-6">
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold text-gray-900">
										Form Preview
									</h2>
									<Button
										onClick={() => setShowPreviewModal(false)}
										variant="outline"
										size="sm"
									>
										<X className="w-4 h-4" />
									</Button>
								</div>

								<div className="space-y-6">
									{/* Form Header */}
									<div className="text-center space-y-3 pb-6 border-b">
										<h3 className="text-2xl font-bold text-gray-900">
											{formToPreview.title}
										</h3>
										<p className="text-gray-600 text-lg">
											{formToPreview.description}
										</p>
										<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
											<FileText className="w-4 h-4" />
											<span>{formToPreview.office}</span>
											<span>•</span>
											<span>{formToPreview.questions.length} questions</span>
										</div>
									</div>

									{/* Form Questions */}
									<div className="space-y-6">
										{formToPreview.questions.map((question, index) => (
											<div key={question.id} className="space-y-3">
												<div className="flex items-start gap-2">
													<span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
														Q{index + 1}
													</span>
													<div className="flex-1">
														<p className="font-medium text-gray-900">
															{question.question}
														</p>
														{question.required && (
															<span className="text-sm text-red-600 ml-2">
																*Required
															</span>
														)}
													</div>
												</div>

												{/* Question Type Display */}
												<div className="ml-8 space-y-3">
													{question.type === "rating" && (
														<div className="flex items-center gap-2">
															{[1, 2, 3, 4, 5].map((rating) => (
																<div
																	key={rating}
																	className="flex items-center gap-1"
																>
																	<input
																		type="radio"
																		name={`preview-${question.id}`}
																		value={rating}
																		disabled
																		className="w-4 h-4 text-blue-600"
																	/>
																	<span className="text-sm text-gray-600">
																		{rating}
																	</span>
																</div>
															))}
															<span className="text-xs text-gray-500 ml-2">
																1 = Poor, 5 = Excellent
															</span>
														</div>
													)}

													{question.type === "yes_no" && (
														<div className="flex items-center gap-4">
															<label className="flex items-center gap-2">
																<input
																	type="radio"
																	name={`preview-${question.id}`}
																	value="Yes"
																	disabled
																	className="w-4 h-4 text-blue-600"
																/>
																<span className="text-sm text-gray-600">
																	Yes
																</span>
															</label>
															<label className="flex items-center gap-2">
																<input
																	type="radio"
																	name={`preview-${question.id}`}
																	value="No"
																	disabled
																	className="w-4 h-4 text-blue-600"
																/>
																<span className="text-sm text-gray-600">
																	No
																</span>
															</label>
														</div>
													)}

													{question.type === "radio" && question.choices && (
														<div className="space-y-2">
															{question.choices.map((choice, choiceIndex) => (
																<label
																	key={choiceIndex}
																	className="flex items-center gap-2"
																>
																	<input
																		type="radio"
																		name={`preview-${question.id}`}
																		value={choice}
																		disabled
																		className="w-4 h-4 text-blue-600"
																	/>
																	<span className="text-sm text-gray-600">
																		{choice}
																	</span>
																</label>
															))}
														</div>
													)}

													{question.type === "checkbox" && question.choices && (
														<div className="space-y-2">
															{question.choices.map((choice, choiceIndex) => (
																<label
																	key={choiceIndex}
																	className="flex items-center gap-2"
																>
																	<input
																		type="checkbox"
																		name={`preview-${question.id}`}
																		value={choice}
																		disabled
																		className="w-4 h-4 text-blue-600"
																	/>
																	<span className="text-sm text-gray-600">
																		{choice}
																	</span>
																</label>
															))}
														</div>
													)}

													{question.type === "text" && (
														<textarea
															placeholder="Type your answer here..."
															disabled
															className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 resize-none"
															rows={3}
														/>
													)}
												</div>
											</div>
										))}
									</div>

									{/* Form Footer */}
									<div className="pt-6 border-t text-center">
										<div className="text-sm text-gray-500 space-y-2">
											<p>
												<strong>Note:</strong> This is a preview of how the form
												will appear to customers. All form fields are disabled
												for preview purposes.
											</p>
											<p>
												Form Status:{" "}
												<Badge
													className={
														formToPreview.status === "active"
															? "bg-green-100 text-green-800"
															: formToPreview.status === "draft"
															? "bg-yellow-100 text-yellow-800"
															: "bg-gray-100 text-gray-800"
													}
												>
													{formToPreview.status}
												</Badge>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
