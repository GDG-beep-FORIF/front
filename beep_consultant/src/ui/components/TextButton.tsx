interface ButtonProps {
    text: string,
    onClick: any
}

const TextButton = ({text, onClick}: ButtonProps) => {
    return (
        <button className="text-dark-green hover:text-dark-green" onClick={onClick}>
            {text}
        </button>
    )
}

export default TextButton;