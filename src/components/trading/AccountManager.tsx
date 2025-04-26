
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wallet } from 'lucide-react';
import { TradingAccount } from '@/types/trading';

interface AccountManagerProps {
  accounts: TradingAccount[];
  activeAccountId: string;
  onSelectAccount: (id: string) => void;
  onCreateAccount: (name: string, balance: number) => void;
  onDeleteAccount: (id: string) => void;
}

const AccountManager = ({
  accounts,
  activeAccountId,
  onSelectAccount,
  onCreateAccount,
  onDeleteAccount
}: AccountManagerProps) => {
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState(10000);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateAccount = () => {
    if (newAccountName && newAccountBalance > 0) {
      onCreateAccount(newAccountName, newAccountBalance);
      setNewAccountName('');
      setNewAccountBalance(10000);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <Select value={activeAccountId} onValueChange={onSelectAccount}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map(account => (
            <SelectItem key={account.id} value={account.id}>
              {account.name} (${account.balance.toLocaleString()})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Wallet className="h-4 w-4 mr-2" />
            New Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Trading Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Name</label>
              <Input
                placeholder="Enter account name"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Balance ($)</label>
              <Input
                type="number"
                min="100"
                step="100"
                value={newAccountBalance}
                onChange={(e) => setNewAccountBalance(Number(e.target.value))}
              />
            </div>
            <Button className="w-full" onClick={handleCreateAccount}>
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {accounts.length > 1 && (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDeleteAccount(activeAccountId)}
        >
          Delete Account
        </Button>
      )}
    </div>
  );
};

export default AccountManager;
