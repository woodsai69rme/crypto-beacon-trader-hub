
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ApiProvider } from "@/types/trading";
import { ChevronDown, ChevronRight, ExternalLink, Key } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MobileOptimizedApiProviderProps {
  provider: ApiProvider;
  onToggle: (id: string) => void;
  onUpdateApiKey: (id: string, apiKey: string) => void;
}

const MobileOptimizedApiProvider: React.FC<MobileOptimizedApiProviderProps> = ({
  provider,
  onToggle,
  onUpdateApiKey,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(provider.apiKey || "");
  const [showApiKey, setShowApiKey] = React.useState(false);

  const handleApiKeySave = () => {
    onUpdateApiKey(provider.id, apiKey);
  };

  return (
    <Card className={!provider.enabled ? "opacity-60" : ""}>
      <CardHeader className="cursor-pointer py-3" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-base">{provider.name}</CardTitle>
          </div>
          <Switch
            checked={provider.enabled}
            onCheckedChange={() => onToggle(provider.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 space-y-3">
            <p className="text-sm">{provider.description}</p>

            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base URL:</span>
                <span className="font-mono">{provider.baseUrl}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Auth Required:</span>
                <span>
                  {provider.requiresAuth || provider.authRequired ? "Yes" : "No"}
                </span>
              </div>

              {(provider.requiresAuth || provider.authRequired) && (
                <div className="space-y-2 mt-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span className="text-sm font-medium">API Key</span>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="text-xs h-8"
                      placeholder="Enter API key"
                    />
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleApiKeySave}
                    >
                      Save
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="show-api-key"
                      checked={showApiKey}
                      onCheckedChange={setShowApiKey}
                    />
                    <label
                      htmlFor="show-api-key"
                      className="text-xs cursor-pointer"
                    >
                      Show API Key
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 mt-2 border-t">
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs"
                  asChild
                >
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>

                <Button
                  variant="link"
                  className="p-0 h-auto text-xs"
                  asChild
                >
                  <a
                    href={provider.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Docs <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default MobileOptimizedApiProvider;
