import { auth } from "@/lib/auth";
import { listUserNotifications } from "@/features/notifications/service";
import { markNotificationsReadAction, markOneNotificationAction } from "@/features/athlete/actions";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AthleteNotificationsPage() {
  const session = await auth();
  const notifications = await listUserNotifications(session!.user.id, 50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">اعلان‌ها</h1>
        <form action={markNotificationsReadAction}>
          <Button type="submit" variant="outline" size="sm">
            خواندن همه
          </Button>
        </form>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={n.isRead ? "opacity-60" : "border-primary/20"}>
            <CardContent className="flex items-start justify-between gap-3 py-4">
              <div>
                <p className="font-bold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatJalaliDateTime(n.createdAt)}
                </p>
              </div>
              {!n.isRead ? (
                <form action={markOneNotificationAction}>
                  <input type="hidden" name="id" value={n.id} />
                  <Button type="submit" size="sm" variant="ghost">
                    خواندم
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {!notifications.length ? (
          <p className="text-muted-foreground">اعلانی وجود ندارد.</p>
        ) : null}
      </div>
    </div>
  );
}
