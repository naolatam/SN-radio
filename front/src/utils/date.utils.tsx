export default function dateToTimeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const secondsAgo = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
    } else if (secondsAgo < 3600) {
        const minutes = Math.floor(secondsAgo / 60);
        return `${minutes} minutes ago`;
    } else if (secondsAgo < 86400) {
        const hours = Math.floor(secondsAgo / 3600);
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(secondsAgo / 86400);
        return `${days} days ago`;
    }
}