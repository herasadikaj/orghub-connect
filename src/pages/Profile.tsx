import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { useLogout } from '@/features/auth/hooks/useLogout';
import ProfileForm from '@/features/auth/components/ProfileForm';
import { ArrowLeft, LogOut, Loader2, AlertCircle } from 'lucide-react';

export default function Profile() {
    const { data: user, isLoading, error } = useProfile();
    const logout = useLogout();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error Loading Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error?.message || 'Unable to load profile data'}
                            </AlertDescription>
                        </Alert>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4">
            <div className="container mx-auto max-w-2xl py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Button asChild variant="ghost">
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button onClick={logout} variant="destructive" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Your Profile</CardTitle>
                        <CardDescription>View and edit your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-muted-foreground">User ID</span>
                                <span className="text-sm font-mono">{user.id}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-muted-foreground">Current Email</span>
                                <span className="text-sm">{user.email}</span>
                            </div>
                            {user.name && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-muted-foreground">Current Name</span>
                                    <span className="text-sm">{user.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                            <ProfileForm user={user} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
