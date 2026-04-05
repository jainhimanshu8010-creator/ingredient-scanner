import { useState } from 'react';
import { supabase, User } from '../lib/supabase';
import { Loader2, Apple, Leaf } from 'lucide-react';

type LoginPageProps = {
  onLoginSuccess: (user: User) => void;
};

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<'dietician' | 'gym_freak' | 'adult' | 'student'>('adult');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!name || !age || !city || !email || !password) {
        throw new Error('Please fill in all fields');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name,
            age: parseInt(age),
            city,
            category,
          },
        ])
        .select()
        .single();

      if (userError) throw userError;

      onLoginSuccess(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to sign in');

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      onLoginSuccess(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
          <div className="relative px-6 py-10 bg-gradient-to-br from-emerald-600 to-emerald-700">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="relative flex items-center justify-center gap-3 mb-3">
              <Leaf className="text-white" size={32} />
              <h1 className="text-4xl font-bold text-white">FOOD DECODE</h1>
            </div>
            <p className="text-emerald-50 text-center font-light tracking-wide">
              {isSignUp ? 'Join Food Decode - Eat Smarter Daily' : 'Welcome back'}
            </p>
          </div>

          <div className="p-7">
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        Age
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                        placeholder="25"
                        disabled={loading}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                        placeholder="New York"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      I am a
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                      disabled={loading}
                    >
                      <option value="dietician">Dietician</option>
                      <option value="gym_freak">Fitness Enthusiast</option>
                      <option value="adult">Health Conscious Adult</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                </>
              )}

              <div className="group">
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-in fade-in">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {isSignUp ? 'Join Food Decode' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  disabled={loading}
                  className="ml-2 text-emerald-400 hover:text-emerald-300 font-semibold disabled:opacity-50 transition duration-200"
                >
                  {isSignUp ? 'Sign In' : 'Join Now'}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>Make informed food choices every day</p>
        </div>
      </div>
    </div>
  );
}
