import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Ad {
  id: string;
  headline: string;
  primary_text: string;
}

const AdSlot = () => {
  const { user } = useAuth();
  const [ad, setAd] = useState<Ad | null>(null);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.rpc("get_ad_for_delivery" as any);
      if (!active || error || !data) return;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.headline) { setAd(null); return; }
      setAd({ id: row.id, headline: row.headline, primary_text: row.primary_text });
    })();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!ad || recorded) return;
    setRecorded(true);
    supabase.rpc("record_ad_event" as any, { _campaign_id: ad.id, _event_type: "impression" });
  }, [ad, recorded]);

  if (!ad) return null;

  const onClick = () => {
    supabase.rpc("record_ad_event" as any, { _campaign_id: ad.id, _event_type: "click" });
  };

  return (
    <button onClick={onClick} className="w-full text-left">
      <Card className="border border-accent/40 bg-accent/5 shadow-premium rounded-2xl">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Megaphone className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-bold text-foreground truncate">{ad.headline}</p>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Sponsored</span>
            </div>
            {ad.primary_text && (
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{ad.primary_text}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </button>
  );
};

export default AdSlot;
