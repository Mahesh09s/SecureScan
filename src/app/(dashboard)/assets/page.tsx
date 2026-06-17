
"use client";

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Globe, 
  Server, 
  Hash, 
  MoreVertical,
  Filter,
  ShieldCheck,
  Trash2,
  Edit2,
  LayoutGrid
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useAuth } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

const assetSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  target: z.string().min(3, "Target is required"),
  type: z.enum(["Website", "Domain", "Server", "IP"]),
  environment: z.string().default("Production"),
  description: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

export default function AssetsPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const assetsQuery = useMemo(() => {
    if (!firestore || !auth?.currentUser) return null;
    return query(
      collection(firestore, 'assets'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, auth?.currentUser]);

  const { data: assets, loading } = useCollection(assetsQuery);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      target: "",
      type: "Website",
      environment: "Production",
      description: "",
    },
  });

  const onSubmit = async (values: AssetFormValues) => {
    if (!firestore || !auth?.currentUser) return;

    try {
      if (editingAsset) {
        const assetRef = doc(firestore, 'assets', editingAsset.id);
        updateDoc(assetRef, {
          ...values,
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Asset Updated", description: `${values.name} has been updated.` });
      } else {
        addDoc(collection(firestore, 'assets'), {
          ...values,
          ownerId: auth.currentUser.uid,
          status: "Healthy",
          createdAt: serverTimestamp(),
        });
        toast({ title: "Asset Added", description: `${values.name} is now ready for scanning.` });
      }
      setIsDialogOpen(false);
      setEditingAsset(null);
      form.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong. Please try again." });
    }
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, 'assets', id));
    toast({ title: "Asset Deleted", description: "The asset has been removed from your inventory." });
  };

  const filteredAssets = assets?.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Asset Inventory</h2>
          <p className="text-muted-foreground">Manage and track your authorized security targets.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAsset(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="cyber-gradient border-none shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl gap-2 h-11 px-6">
              <Plus className="w-5 h-5" />
              Add New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the details of the asset you want to monitor.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Production API" {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target (URL, Domain, or IP)</FormLabel>
                      <FormControl>
                        <Input placeholder="api.company.com" {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Domain">Domain</SelectItem>
                            <SelectItem value="Server">Server</SelectItem>
                            <SelectItem value="IP">IP Address</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="environment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Environment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select env" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Staging">Staging</SelectItem>
                            <SelectItem value="Development">Development</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Critical customer data API" {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full cyber-gradient border-none">
                    {editingAsset ? 'Update Asset' : 'Add Asset'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/50 text-white" 
            placeholder="Search by name or target..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-white/10 h-12 rounded-xl gap-2 hover:bg-white/5 text-white">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-muted-foreground animate-pulse">Loading your assets...</div>
        ) : filteredAssets && filteredAssets.length > 0 ? (
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Asset</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Target</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Environment</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="border-border hover:bg-white/5 transition-colors group">
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {asset.type === 'Website' ? <Globe className="w-4 h-4" /> : asset.type === 'Server' ? <Server className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-primary transition-colors">{asset.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{asset.type}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{asset.target}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-white/10">
                      {asset.environment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        asset.status === 'Healthy' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : asset.status === 'Scanning' ? "bg-primary animate-pulse" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      )}></div>
                      <span className="text-xs font-medium text-white">{asset.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-white/10 text-white">
                        <DropdownMenuItem onClick={() => {
                          setEditingAsset(asset);
                          form.reset({
                            name: asset.name,
                            target: asset.target,
                            type: asset.type,
                            environment: asset.environment,
                            description: asset.description || "",
                          });
                          setIsDialogOpen(true);
                        }} className="gap-2">
                          <Edit2 className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(asset.id)} className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <LayoutGrid className="w-12 h-12 text-muted-foreground opacity-20" />
            <div className="space-y-1">
              <p className="text-white font-bold">No assets found</p>
              <p className="text-sm text-muted-foreground">Add your first target to begin scanning.</p>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-l-4 border-l-primary p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Asset Verification</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ensure you have explicit permission to scan these targets. Verification may be required for automated active vulnerability assessments.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
