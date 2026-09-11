import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AthleteSettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">تنظیمات</h1>
      <Card>
        <CardHeader>
          <CardTitle>حساب کاربری</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">نام: </span>
            {session?.user.name}
          </p>
          <p>
            <span className="text-muted-foreground">ایمیل: </span>
            {session?.user.email}
          </p>
          <p>
            <span className="text-muted-foreground">نقش: </span>
            ورزشکار
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
