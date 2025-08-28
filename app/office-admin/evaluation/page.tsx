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
	const [showQRModal, setShowQRModal] = useState(false);
	const [selectedForm, setSelectedForm] = useState<EvaluationForm | null>(null);
	const [isMounted, setIsMounted] = useState(false);
	const [activeTab, setActiveTab] = useState("forms");
	const [searchTerm, setSearchTerm] = useState("");
	const [filterService, setFilterService] = useState("all");
	const [filterDate, setFilterDate] = useState("all");

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
		loadEvaluationResponses();
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
					{
						id: "q3",
						question: "What type of assistance did you receive?",
						type: "checkbox",
						required: true,
						choices: [
							"Priority queue access",
							"Dedicated staff support",
							"Expedited processing",
							"Regular queue access",
						],
					},
				],
				createdAt: new Date().toISOString(),
				status: "active",
			},
			{
				id: "eval-003",
				title: "Document Processing Evaluation",
				description: "Evaluation form for document-related services",
				office: currentAdmin.office,
				services: ["Document Authentication", "Academic Records"],
				questions: [
					{
						id: "q1",
						question:
							"How satisfied are you with the document processing speed?",
						type: "rating",
						required: true,
					},
					{
						id: "q2",
						question: "Which service option did you choose?",
						type: "radio",
						required: true,
						choices: [
							"Express processing",
							"Standard processing",
							"Basic processing",
						],
					},
					{
						id: "q3",
						question: "Any specific feedback about the process?",
						type: "text",
						required: false,
					},
				],
				createdAt: new Date().toISOString(),
				status: "active",
			},
			{
				id: "eval-004",
				title: "Customer Experience Survey",
				description: "Qualitative feedback form with no rating questions",
				office: currentAdmin.office,
				services: ["All Services"],
				questions: [
					{
						id: "q1",
						question: "Did you find our office location easily?",
						type: "yes_no",
						required: true,
					},
					{
						id: "q2",
						question: "What was your primary reason for visiting today?",
						type: "radio",
						required: true,
						choices: [
							"Academic records",
							"Enrollment",
							"Document processing",
							"General inquiry",
							"Other",
						],
					},
					{
						id: "q3",
						question: "Which communication channels do you prefer?",
						type: "checkbox",
						required: true,
						choices: [
							"Email",
							"SMS",
							"Phone call",
							"In-person",
							"Online portal",
						],
					},
					{
						id: "q4",
						question: "Describe your overall experience today",
						type: "text",
						required: true,
					},
					{
						id: "q5",
						question: "Would you recommend our services to others?",
						type: "yes_no",
						required: true,
					},
				],
				createdAt: new Date().toISOString(),
				status: "active",
			},
		];
		setEvaluationForms(sampleForms);
	};

	const loadEvaluationResponses = () => {
		// In a real app, this would fetch from an API
		const sampleResponses: EvaluationResponse[] = [
			{
				id: "resp-001",
				formId: "eval-001",
				customerName: "John Smith",
				customerEmail: "john.smith@email.com",
				service: "Transcript Request",
				staffMember: "Maria Santos",
				submittedAt: new Date(
					Date.now() - 2 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "How would you rate the overall service quality?",
						answer: 5,
						type: "rating",
					},
					{
						questionId: "q2",
						question: "How long did you wait to be served?",
						answer: 3,
						type: "rating",
					},
					{
						questionId: "q3",
						question: "Any additional comments or suggestions?",
						answer:
							"Excellent service! Staff was very helpful and professional.",
						type: "text",
					},
				],
				overallRating: 4.5,
				comments:
					"Very satisfied with the service quality and staff professionalism.",
			},
			{
				id: "resp-002",
				formId: "eval-001",
				customerName: "Sarah Johnson",
				customerEmail: "sarah.j@email.com",
				service: "Certificate Issuance",
				staffMember: "Carlos Rodriguez",
				submittedAt: new Date(
					Date.now() - 1 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "How would you rate the overall service quality?",
						answer: 4,
						type: "rating",
					},
					{
						questionId: "q2",
						question: "How long did you wait to be served?",
						answer: 4,
						type: "rating",
					},
					{
						questionId: "q3",
						question: "Any additional comments or suggestions?",
						answer:
							"Good service, but could improve on wait times during peak hours.",
						type: "text",
					},
				],
				overallRating: 4.0,
				comments:
					"Overall good experience, but waiting time could be improved.",
			},
			{
				id: "resp-003",
				formId: "eval-001",
				customerName: "Michael Brown",
				customerEmail: "michael.b@email.com",
				service: "Transcript Request",
				staffMember: "Maria Santos",
				submittedAt: new Date().toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "How would you rate the overall service quality?",
						answer: 5,
						type: "rating",
					},
					{
						questionId: "q2",
						question: "How long did you wait to be served?",
						answer: 2,
						type: "rating",
					},
					{
						questionId: "q3",
						question: "Any additional comments or suggestions?",
						answer: "Fast and efficient service. Highly recommended!",
						type: "text",
					},
				],
				overallRating: 5.0,
				comments: "Excellent service! Very fast and efficient.",
			},
			{
				id: "resp-004",
				formId: "eval-002",
				customerName: "Emily Davis",
				customerEmail: "emily.d@email.com",
				service: "Enrollment",
				staffMember: "Ana Garcia",
				submittedAt: new Date(
					Date.now() - 3 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "Was your priority status properly recognized?",
						answer: "Yes",
						type: "yes_no",
					},
					{
						questionId: "q2",
						question: "Rate the staff's assistance with your priority needs",
						answer: 5,
						type: "rating",
					},
					{
						questionId: "q3",
						question: "What type of assistance did you receive?",
						answer: "Priority queue access, Dedicated staff support",
						type: "checkbox",
					},
				],
				overallRating: 5.0,
				comments:
					"Priority service was excellent. Staff went above and beyond.",
			},
			{
				id: "resp-005",
				formId: "eval-002",
				customerName: "David Wilson",
				customerEmail: "david.w@email.com",
				service: "Grade Verification",
				staffMember: "Ana Garcia",
				submittedAt: new Date(
					Date.now() - 4 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "Was your priority status properly recognized?",
						answer: "No",
						type: "yes_no",
					},
					{
						questionId: "q2",
						question: "Rate the staff's assistance with your priority needs",
						answer: 3,
						type: "rating",
					},
					{
						questionId: "q3",
						question: "What type of assistance did you receive?",
						answer: "Regular queue access",
						type: "checkbox",
					},
				],
				overallRating: 3.0,
				comments:
					"Priority status was not recognized initially, but staff was helpful once identified.",
			},
			{
				id: "resp-006",
				formId: "eval-003",
				customerName: "Lisa Chen",
				customerEmail: "lisa.c@email.com",
				service: "Document Authentication",
				staffMember: "Carlos Rodriguez",
				submittedAt: new Date(
					Date.now() - 5 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question:
							"How satisfied are you with the document processing speed?",
						answer: 4,
						type: "rating",
					},
					{
						questionId: "q2",
						question: "Which service option did you choose?",
						answer: "Standard processing",
						type: "radio",
					},
					{
						questionId: "q3",
						question: "Any specific feedback about the process?",
						answer:
							"The process was straightforward but could use more online options.",
						type: "text",
					},
				],
				overallRating: 4.0,
				comments:
					"Good service overall, would appreciate more digital options.",
			},
			{
				id: "resp-007",
				formId: "eval-004",
				customerName: "Alex Thompson",
				customerEmail: "alex.t@email.com",
				service: "General Inquiry",
				staffMember: "Maria Santos",
				submittedAt: new Date(
					Date.now() - 6 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "Did you find our office location easily?",
						answer: "Yes",
						type: "yes_no",
					},
					{
						questionId: "q2",
						question: "What was your primary reason for visiting today?",
						answer: "General inquiry",
						type: "radio",
					},
					{
						questionId: "q3",
						question: "Which communication channels do you prefer?",
						answer: "Email, Online portal",
						type: "checkbox",
					},
					{
						questionId: "q4",
						question: "Describe your overall experience today",
						answer:
							"Very helpful staff who answered all my questions clearly. The office was clean and well-organized.",
						type: "text",
					},
					{
						questionId: "q5",
						question: "Would you recommend our services to others?",
						answer: "Yes",
						type: "yes_no",
					},
				],
				overallRating: 0, // No rating questions in this form
				comments: "Excellent customer service experience.",
			},
			{
				id: "resp-008",
				formId: "eval-004",
				customerName: "Rachel Green",
				customerEmail: "rachel.g@email.com",
				service: "Academic Records",
				staffMember: "Ana Garcia",
				submittedAt: new Date(
					Date.now() - 7 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "Did you find our office location easily?",
						answer: "No",
						type: "yes_no",
					},
					{
						questionId: "q2",
						question: "What was your primary reason for visiting today?",
						answer: "Academic records",
						type: "radio",
					},
					{
						questionId: "q3",
						question: "Which communication channels do you prefer?",
						answer: "SMS, Phone call",
						type: "checkbox",
					},
					{
						questionId: "q4",
						question: "Describe your overall experience today",
						answer:
							"Had trouble finding the office initially, but once inside, the staff was very helpful and efficient.",
						type: "text",
					},
					{
						questionId: "q5",
						question: "Would you recommend our services to others?",
						answer: "Yes",
						type: "yes_no",
					},
				],
				overallRating: 0, // No rating questions in this form
				comments: "Good service but better signage would help.",
			},
			{
				id: "resp-009",
				formId: "eval-004",
				customerName: "Tom Anderson",
				customerEmail: "tom.a@email.com",
				service: "Enrollment",
				staffMember: "Carlos Rodriguez",
				submittedAt: new Date(
					Date.now() - 8 * 24 * 60 * 60 * 1000
				).toISOString(),
				responses: [
					{
						questionId: "q1",
						question: "Did you find our office location easily?",
						answer: "Yes",
						type: "yes_no",
					},
					{
						questionId: "q2",
						question: "What was your primary reason for visiting today?",
						answer: "Enrollment",
						type: "radio",
					},
					{
						questionId: "q3",
						question: "Which communication channels do you prefer?",
						answer: "Email, In-person",
						type: "checkbox",
					},
					{
						questionId: "q4",
						question: "Describe your overall experience today",
						answer:
							"The enrollment process was smooth and well-explained. Staff took time to answer all my questions.",
						type: "text",
					},
					{
						questionId: "q5",
						question: "Would you recommend our services to others?",
						answer: "Yes",
						type: "yes_no",
					},
				],
				overallRating: 0, // No rating questions in this form
				comments: "Very professional and helpful staff.",
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

	// Calculate analytics
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
															{form.status === "active"
																? "Deactivate"
																: "Activate"}
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
												Create Your First Form
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
															{new Date(
																response.submittedAt
															).toLocaleDateString()}{" "}
															at{" "}
															{new Date(
																response.submittedAt
															).toLocaleTimeString()}
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

				{/* Create Form Modal */}
				{showCreateForm && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-6 space-y-6">
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold">
										Create Evaluation Form
									</h2>
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
			</div>
		</div>
	);
}
