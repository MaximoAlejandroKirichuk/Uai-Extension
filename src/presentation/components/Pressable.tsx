interface Props {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}


export const Pressable = ({ label, onClick, type = "button", disabled = false }: Props) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
            {label}
        </button>
    )
}
