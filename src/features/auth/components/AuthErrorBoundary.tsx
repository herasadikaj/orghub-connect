import { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthErrorBoundaryProps {
    children: ReactNode;
}

interface AuthErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Authentication Error Boundary
 * 
 * Specialized error boundary for authentication-related components.
 * Provides auth-specific error messages and recovery actions.
 */
export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
    constructor(props: AuthErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('AuthErrorBoundary caught an error:', error, errorInfo);

        // Log auth errors for monitoring
        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });

        // Clear any potentially corrupted auth state
        localStorage.removeItem('auth-storage');

        // Reload page to reset state
        window.location.href = '/auth';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-5 w-5" />
                                Authentication Error
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {this.state.error?.message || 'An error occurred with the authentication system'}
                                </AlertDescription>
                            </Alert>

                            <p className="text-sm text-muted-foreground">
                                This could be due to corrupted session data or a system error.
                                Please try logging in again.
                            </p>

                            <div className="flex flex-col gap-2">
                                <Button onClick={this.handleReset} variant="default" className="w-full">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Return to Login
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        Go to Home
                                    </Link>
                                </Button>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-4 p-3 bg-muted rounded-md text-xs">
                                    <summary className="cursor-pointer font-medium">Technical Details</summary>
                                    <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words">
                                        {this.state.error.stack}
                                    </pre>
                                </details>
                            )}
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
