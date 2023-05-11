const Notification = ({ message, style }: { message: string | null, style: string }) => {
    if (message === null) {
        return null
    }

    return (
        <span className={style}>
            {message}
        </span>
    )
}
export default Notification