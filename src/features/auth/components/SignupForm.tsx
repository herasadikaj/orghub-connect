import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSignup } from '../hooks/useSignup';
import { signupSchema, type SignupInput } from '../schemas/signupSchema';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { signup, isLoading, error, isSuccess } = useSignup();

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    useEffect(() => {
        if (isSuccess) {
            reset();
        }
    }, [isSuccess, reset]);

    const password = watch('password', '');

    const passwordStrength = useMemo(() => {
        if (!password) return { strength: 0, label: '', color: '', widthClass: 'w-0' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
        const widths = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];

        return {
            strength,
            label: labels[strength - 1] || '',
            color: colors[strength - 1] || '',
            widthClass: widths[strength - 1] || 'w-0',
        };
    }, [password]);

    const onSubmit = (data: SignupInput) => {
        signup(data as { email: string; password: string; name?: string });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error.message.includes('409') || error.message.includes('duplicate')
                            ? 'An account with this email already exists'
                            : error.message || 'An error occurred during signup'}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                    {...register('name')}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isLoading}
                />
                {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                />
                {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        {...register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                )}

                {password && passwordStrength.strength > 0 && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${passwordStrength.color} ${passwordStrength.widthClass}`}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground min-w-[80px]">
                                {passwordStrength.label}
                            </span>
                        </div>
                        <div className="space-y-1 text-xs">
                            <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle2 className="h-3 w-3" />
                                <span>At least 8 characters</span>
                            </div>
                            <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle2 className="h-3 w-3" />
                                <span>One uppercase letter</span>
                            </div>
                            <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle2 className="h-3 w-3" />
                                <span>One lowercase letter</span>
                            </div>
                            <div className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle2 className="h-3 w-3" />
                                <span>One number</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
        </form>
    );
}
