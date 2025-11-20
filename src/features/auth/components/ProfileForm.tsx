import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { profileSchema, type UpdateProfileInput } from '../schemas/profileSchema';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import type { User } from '../types';

interface ProfileFormProps {
    user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const { mutate: updateProfile, isPending, error, isSuccess } = useUpdateProfile();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || '',
            email: user.email || '',
        },
    });

    useEffect(() => {
        reset({
            name: user.name || '',
            email: user.email || '',
        });
    }, [user, reset]);

    const onSubmit = (data: UpdateProfileInput) => {
        const updates: { name?: string; email?: string } = {};
        if (data.name && data.name !== user.name) updates.name = data.name;
        if (data.email && data.email !== user.email) updates.email = data.email;

        if (Object.keys(updates).length > 0) {
            updateProfile(updates);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error.message || 'An error occurred while updating your profile'}
                    </AlertDescription>
                </Alert>
            )}

            {isSuccess && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                        Profile updated successfully
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    {...register('name')}
                    id="name"
                    type="text"
                    placeholder="Your name"
                    disabled={isPending}
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
                    disabled={isPending}
                />
                {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            {errors.root && (
                <p className="text-sm text-red-600">{errors.root.message}</p>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    );
}
