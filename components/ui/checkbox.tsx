"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			key="checkbox-root"
			data-slot="checkbox"
			className={cn(
				"peer size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none disabled:cursor-not-allowed disabled:opacity-50",
				"bg-white border-gray-300 focus-visible:ring-[3px] focus-visible:ring-[#088395] focus-visible:border-[#088395]",
				"data-[state=checked]:bg-[#088395] data-[state=checked]:border-[#088395] data-[state=checked]:text-white",
				className
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				key="checkbox-indicator"
				data-slot="checkbox-indicator"
				className="flex items-center justify-center text-white transition-none"
			>
				<CheckIcon key="checkbox-check" className="size-3.5" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
