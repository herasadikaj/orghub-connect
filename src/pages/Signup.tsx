import { Link } from 'react-router-dom';
import SignupForm from '@/features/auth/components/SignupForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Building2 className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Create Your Account</CardTitle>
                    <CardDescription>Join OrgConnect to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/auth" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
