import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { AuthStore } from '../auth/auth-store';

type DashboardItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

@Component({
  selector: 'app-shell',
  imports: [HlmButtonImports, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-svh bg-muted/30 p-6">
      <div class="mx-auto max-w-5xl space-y-6">
        <header
          class="flex items-center justify-between rounded-lg border bg-background p-4 shadow-sm"
        >
          <div>
            <h1 class="text-xl font-semibold">Dashboard</h1>
            <p class="text-sm text-muted-foreground">
              Welcome, {{ authStore.currentUser()?.name }}
            </p>
          </div>

          <button hlmBtn variant="outline" (click)="logout()">
            Sign out
          </button>
        </header>

        <section class="rounded-lg border bg-background shadow-sm">
          <div class="flex items-center justify-between border-b p-4">
            <div>
              <h2 class="text-lg font-semibold">Items</h2>
              <p class="text-sm text-muted-foreground">
                Manage your inventory list
              </p>
            </div>
            <button hlmBtn size="sm" (click)="openAddModal()">Add item</button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-muted/50 text-muted-foreground">
                <tr>
                  <th class="px-4 py-3 font-medium">Name</th>
                  <th class="px-4 py-3 font-medium">Category</th>
                  <th class="px-4 py-3 font-medium">Price</th>
                  <th class="px-4 py-3 font-medium">Stock</th>
                  <th class="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (item of items; track item.id) {
                  <tr class="animate-row-in border-t align-top">
                    @if (editingItemId === item.id && editDraft) {
                      <td class="px-4 py-3">
                        <input
                          class="w-full rounded-md border px-2 py-1.5"
                          [value]="editDraft.name"
                          (input)="updateEditField('name', $any($event.target).value)"
                        />
                      </td>
                      <td class="px-4 py-3">
                        <select
                          class="w-full rounded-md border px-2 py-1.5"
                          [value]="editDraft.category"
                          (change)="updateEditField('category', $any($event.target).value)"
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Office">Office</option>
                        </select>
                      </td>
                      <td class="px-4 py-3">
                        <input
                          class="w-full rounded-md border px-2 py-1.5"
                          type="number"
                          [value]="editDraft.price"
                          (input)="updateEditField('price', +($any($event.target).value || 0))"
                        />
                      </td>
                      <td class="px-4 py-3">
                        <input
                          class="w-full rounded-md border px-2 py-1.5"
                          type="number"
                          [value]="editDraft.stock"
                          (input)="updateEditField('stock', +($any($event.target).value || 0))"
                        />
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex justify-end gap-2">
                          <button hlmBtn size="sm" (click)="saveInlineEdit()">
                            Save
                          </button>
                          <button hlmBtn variant="outline" size="sm" (click)="cancelInlineEdit()">
                            Cancel
                          </button>
                        </div>
                      </td>
                    } @else {
                      <td class="px-4 py-3 font-medium">{{ item.name }}</td>
                      <td class="px-4 py-3 text-muted-foreground">{{ item.category }}</td>
                      <td class="px-4 py-3">{{ formatPrice(item.price) }}</td>
                      <td class="px-4 py-3">{{ item.stock }}</td>
                      <td class="px-4 py-3">
                        <div class="flex justify-end gap-2">
                          <button hlmBtn variant="outline" size="sm" (click)="viewItem(item)">
                            View
                          </button>
                          <button hlmBtn variant="secondary" size="sm" (click)="startInlineEdit(item)">
                            Edit
                          </button>
                          <button hlmBtn variant="destructive" size="sm" (click)="deleteItem(item.id)">
                            Delete
                          </button>
                        </div>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    @if (showAddModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div class="animate-modal-in w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add item</h3>
            <button hlmBtn variant="outline" size="sm" (click)="closeAddModal()">
              Close
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Name</label>
              <input
                class="w-full rounded-md border px-3 py-2"
                [(ngModel)]="newItem.name"
                placeholder="Item name"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Category</label>
              <select
                class="w-full rounded-md border px-3 py-2"
                [(ngModel)]="newItem.category"
              >
                <option value="Electronics">Electronics</option>
                <option value="Groceries">Groceries</option>
                <option value="Furniture">Furniture</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium">Price</label>
                <input
                  class="w-full rounded-md border px-3 py-2"
                  type="number"
                  [(ngModel)]="newItem.price"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium">Stock</label>
                <input
                  class="w-full rounded-md border px-3 py-2"
                  type="number"
                  [(ngModel)]="newItem.stock"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button hlmBtn variant="outline" (click)="closeAddModal()">
              Cancel
            </button>
            <button hlmBtn (click)="saveNewItem()">Save item</button>
          </div>
        </div>
      </div>
    }

    @if (selectedItem) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div class="animate-modal-in w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Item details</h3>
            <button hlmBtn variant="outline" size="sm" (click)="closeViewModal()">
              Close
            </button>
          </div>

          <div class="space-y-3 text-sm">
            <div>
              <p class="text-muted-foreground">Name</p>
              <p class="font-medium">{{ selectedItem.name }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Category</p>
              <p class="font-medium">{{ selectedItem.category }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Price</p>
              <p class="font-medium">{{ formatPrice(selectedItem.price) }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Stock</p>
              <p class="font-medium">{{ selectedItem.stock }}</p>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AppShell {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected items: DashboardItem[] = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1200, stock: 8 },
    { id: 2, name: 'Coffee Beans', category: 'Groceries', price: 18, stock: 24 },
    { id: 3, name: 'Office Chair', category: 'Furniture', price: 240, stock: 5 },
  ];

  protected showAddModal = false;
  protected selectedItem: DashboardItem | null = null;
  protected editingItemId: number | null = null;
  protected editDraft: DashboardItem | null = null;
  protected newItem: DashboardItem = this.createEmptyItem();

  protected formatPrice(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  protected openAddModal(): void {
    this.newItem = this.createEmptyItem();
    this.showAddModal = true;
  }

  protected closeAddModal(): void {
    this.showAddModal = false;
    this.newItem = this.createEmptyItem();
  }

  protected saveNewItem(): void {
    if (!this.newItem.name.trim()) {
      return;
    }

    const itemToSave: DashboardItem = {
      ...this.newItem,
      id: Date.now(),
      name: this.newItem.name.trim(),
      category: this.newItem.category || 'Electronics',
      price: Number(this.newItem.price) || 0,
      stock: Number(this.newItem.stock) || 0,
    };

    this.items = [...this.items, itemToSave];
    this.closeAddModal();
  }

  protected startInlineEdit(item: DashboardItem): void {
    this.editingItemId = item.id;
    this.editDraft = { ...item };
  }

  protected updateEditField(
    field: 'name' | 'category' | 'price' | 'stock',
    value: string | number,
  ): void {
    if (!this.editDraft) {
      return;
    }

    if (field === 'name' || field === 'category') {
      this.editDraft = {
        ...this.editDraft,
        [field]: String(value),
      };
      return;
    }

    this.editDraft = {
      ...this.editDraft,
      [field]: Number(value) || 0,
    };
  }

  protected saveInlineEdit(): void {
    if (!this.editDraft || this.editingItemId === null) {
      return;
    }

    this.items = this.items.map((item) =>
      item.id === this.editingItemId ? { ...this.editDraft! } : item,
    );

    this.cancelInlineEdit();
  }

  protected cancelInlineEdit(): void {
    this.editingItemId = null;
    this.editDraft = null;
  }

  protected deleteItem(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  protected viewItem(item: DashboardItem): void {
    this.selectedItem = item;
  }

  protected closeViewModal(): void {
    this.selectedItem = null;
  }

  protected logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/auth/login']);
  }

  private createEmptyItem(): DashboardItem {
    return {
      id: Date.now(),
      name: '',
      category: 'Electronics',
      price: 0,
      stock: 0,
    };
  }
}