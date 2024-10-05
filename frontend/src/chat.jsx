export default function Chat() {
    return(
        <iframe
            src="http://localhost:3000/channel/general"
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
            }}
            title="Rocket.Chat"
        ></iframe>
    )
}