import {Component, computed, inject} from '@angular/core';
import {LayoutService} from '../service/layout.service';

@Component({
  selector: '[app-footer]',
  standalone: true,
  template: `
    <!-- Main footer container with flexbox for alignment -->
    <div class="flex justify-between items-center px-6 py-4">
      <!-- Container for logo and app name, aligned with flexbox -->
      <div class="flex items-center gap-2">
        <!-- Logo image with a fixed height for consistent sizing -->
        <img class="h-8 object-contain" src="/layout/images/logo/admission.png" alt="Admission Logo"/>

        <!-- App name with modern typography styling -->
<!--        <span class="text-lg font-bold text-gray-700">Poseidon</span>-->
      </div>

      <!-- Copyright text with appropriate size and color -->
      <span class="text-sm text-gray-500">© Your Organization - 2025 V.1.0</span>
    </div>
  `
})
export class AppFooter {
  layoutService = inject(LayoutService);

  isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
