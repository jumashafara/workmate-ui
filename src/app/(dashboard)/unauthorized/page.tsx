"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShieldX, 
  ArrowLeft, 
  MessageSquare, 
  BarChart3,
  Users,
  Mail
} from "lucide-react";
import { getUserData } from "@/utils/cookie";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("");
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);

  useEffect(() => {
    const userData = getUserData();
    setUserRole(userData.role || "");
    setIsSuperuser(userData.superuser || false);
  }, []);

  const getAvailableRoutes = () => {
    if (isSuperuser) {
      return [
        { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
        { name: "Chat", path: "/chat", icon: MessageSquare },
        { name: "Superuser Panel", path: "/superuser", icon: Users },
        { name: "Model Metrics", path: "/model-metrics", icon: BarChart3 },
        { name: "Area Manager", path: "/area-manager", icon: Users },
      ];
    } else if (userRole === "area_manager") {
      return [
        { name: "Chat", path: "/chat", icon: MessageSquare },
        { name: "Area Manager Dashboard", path: "/area-manager/predictions", icon: BarChart3 },
        { name: "Area Manager Trends", path: "/area-manager/trends", icon: BarChart3 },
      ];
    } else {
      return [
        { name: "Chat", path: "/chat", icon: MessageSquare },
      ];
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToRoute = (path: string) => {
    router.push(path);
  };

  const availableRoutes = getAvailableRoutes();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <ShieldX className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You don't have permission to access this page. Your current role 
              <span className="font-semibold"> ({userRole || "user"})</span> doesn't 
              include access to this resource.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Pages for You:
            </h3>
            
            <div className="grid gap-3">
              {availableRoutes.map((route) => {
                const IconComponent = route.icon;
                return (
                  <Button
                    key={route.path}
                    variant="outline"
                    className="justify-start h-auto p-4 text-left hover:bg-orange-50 hover:border-orange-200"
                    onClick={() => handleGoToRoute(route.path)}
                  >
                    <IconComponent className="h-5 w-5 mr-3 text-orange-600" />
                    <div>
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-gray-500">{route.path}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-gray-900">Need Additional Access?</h4>
            <p className="text-sm text-gray-600">
              If you believe you should have access to this page or need additional 
              permissions, please reach out to your system administrator or contact 
              support.
            </p>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open("mailto:support@yourcompany.com", "_blank")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button
              onClick={() => handleGoToRoute(availableRoutes[0]?.path || "/chat")}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Go to {availableRoutes[0]?.name || "Chat"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
