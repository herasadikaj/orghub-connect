import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-2xl">Login Failed</CardTitle>
                    <CardDescription>We couldn't log you in with those credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Invalid Credentials</AlertTitle>
                        <AlertDescription>
                            The email or password you entered is incorrect. Please try again.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Button asChild className="w-full">
                            <Link to="/auth">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Try Again
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="w-full">
                            <Link to="/signup">
                                Create New Account
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
