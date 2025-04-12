
interface Props {
    label: string,
    onClick: () => void
}


export const Pressable = ({label, onClick}: Props) => {
    return (
        <button
            onClick={onClick} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
            {label}
        </button>
    )
}
