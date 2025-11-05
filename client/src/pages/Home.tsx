import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import AdWatchingSection from "@/components/AdWatchingSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import PromoCodeInput from "@/components/PromoCodeInput";
import { PlusCircle } from "lucide-react";
import { useLocation } from "wouter";

// Type definition for user object
interface User {
  id?: string;
  telegramId?: string;
  balance?: string;
  lastStreakDate?: string;
  [key: string]: any;
}

export default function Home() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user, isLoading, authenticateWithTelegramWebApp, isTelegramAuthenticating, telegramAuthError } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<{
    todayEarnings?: string;
    referralEarnings?: string;
  }>({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  const { data: tasksData } = useQuery<{
    tasks?: Array<{ claimed: boolean; [key: string]: any }>;
    adsWatchedToday?: number;
  }>({
    queryKey: ["/api/tasks/daily"],
    retry: false,
  });

  const { data: appSettings } = useQuery<{ dailyAdLimit: number }>({
    queryKey: ['/api/app-settings'],
    retry: false,
  });



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-primary text-3xl mb-4">
            <i className="fas fa-spinner"></i>
          </div>
          <div className="text-foreground font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Authentication Status */}
        {!(user as User) && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-info-circle text-blue-600 dark:text-blue-400"></i>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Telegram Mini App</h3>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
              This app is designed to work as a Telegram Mini App. For full functionality, access it through your Telegram bot.
            </p>
            {typeof window !== 'undefined' && window.Telegram?.WebApp ? (
              <Button 
                onClick={authenticateWithTelegramWebApp}
                disabled={isTelegramAuthenticating}
                className="w-full"
              >
                {isTelegramAuthenticating ? "Authenticating..." : "Login with Telegram"}
              </Button>
            ) : (
              <div className="text-blue-700 dark:text-blue-300 text-sm">
                <p className="mb-2">Currently running in browser mode for development.</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  💡 To test: Open via Telegram → Your Bot → Web App
                </p>
              </div>
            )}
            {telegramAuthError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                Error: {telegramAuthError.message}
              </p>
            )}
          </div>
        )}

        {/* Development Mode Notice - only show in actual development */}
        {(user as User) && typeof window !== 'undefined' && !window.Telegram?.WebApp && window.location.hostname.includes('replit') && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <i className="fas fa-flask text-yellow-600 dark:text-yellow-400 text-sm"></i>
              <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                Development Mode - Test Account Active
              </span>
            </div>
          </div>
        )}

        {/* Income Statistics Widget */}
        <div className="mt-3 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-3 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-2">Income statistics</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Today:</span>
              <span className="font-semibold text-white">
                {statsLoading ? "..." : stats?.todayEarnings || "0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">All time:</span>
              <span className="font-semibold text-white">
                {statsLoading ? "..." : Math.round(parseFloat((user as User)?.balance || "0") * 500000)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">On referrals:</span>
              <span className="font-semibold text-white">
                {statsLoading ? "..." : stats?.referralEarnings || "0.00"}
              </span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <div className="text-xs font-medium text-gray-300 mb-1.5">Today's activity:</div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Tasks</span>
                <span className="font-semibold text-white">
                  {tasksData?.tasks?.filter((t: any) => t.claimed)?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Ads</span>
                <span className="font-semibold text-white">
                  {tasksData?.adsWatchedToday ?? 0}/{appSettings?.dailyAdLimit ?? 50}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Ads Section */}
        <AdWatchingSection user={user as User} />

        {/* Promo Code Section */}
        <Card className="mt-3 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-[#4cd3ff]/20 rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-3">🎟️ Have a Promo Code?</h3>
          <PromoCodeInput />
        </Card>

        {/* Create Task Button */}
        <Card className="mt-3 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-purple-500/30 rounded-xl shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-base font-semibold text-white mb-2">
                Create Your Own Task
              </h3>
              <Button
                onClick={() => navigate('/create-task')}
                className="w-full bg-[#4cd3ff] hover:bg-[#6ddeff] text-black font-semibold rounded-lg transition-all active:scale-[0.97] shadow-[0_0_20px_rgba(76,211,255,0.4)]"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Network Chat Section */}
        <Card className="mt-3 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-purple-500/30 rounded-xl shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-base font-semibold text-white mb-2">
                Network with other members in our chat room
              </h3>
              <Button
                onClick={() => {
                  if (window.Telegram?.WebApp?.openTelegramLink) {
                    window.Telegram.WebApp.openTelegramLink('https://t.me/PaidAdsCommunity');
                  } else {
                    window.open('https://t.me/PaidAdsCommunity', '_blank');
                  }
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                <i className="fas fa-comments mr-2"></i>
                Go to chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
}
