import { requireOrganizer } from "@/lib/session";
import { getOrganizerEvents } from "@/lib/actions/events";
import DashboardContent from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
    const session = await requireOrganizer();
    const { events, totalRevenue, totalNetPayout, totalTicketsSold } = await getOrganizerEvents();

    return (
        <DashboardContent 
            initialEvents={events} 
            userName={session.user.name} 
            totalRevenue={totalRevenue}
            totalNetPayout={totalNetPayout}
            totalTicketsSold={totalTicketsSold}
        />
    );
}
