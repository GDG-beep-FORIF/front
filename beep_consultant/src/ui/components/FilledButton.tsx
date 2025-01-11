interface ButtonProps {
    text: string,
    onClick: any
}

const FilledButton = ({text, onClick}: ButtonProps) => {
    return (
        <button className="px-4 py-2 bg-dark-green text-white rounded-lg hover:bg-dark-green" onClick={onClick}>
            {text}
        </button>
    )
}

export default FilledButton;