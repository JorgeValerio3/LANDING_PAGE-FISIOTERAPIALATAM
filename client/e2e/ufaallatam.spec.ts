import { test, expect, Page } from '@playwright/test';

/**
 * QA: Suite de Pruebas E2E para Plataforma UFAAL (v10 - Atomic Operations)
 */

async function prepareCleanState(page: Page) {
  // QA: Limpieza profunda de cookies para ambos dominios (Cliente y API)
  await page.context().clearCookies();
  
  // Inyectar CSS para ocultar el GlobalLoader (Optimización)
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.id = 'qa-hide-loader';
    style.innerHTML = '.fixed.inset-0.z-\\[100\\] { display: none !important; }';
    document.head.appendChild(style);
  });
}

test.describe('UFAAL - Flujos Críticos E2E', () => {
  test.beforeEach(async ({ page }) => {
    await prepareCleanState(page);
  });

  test('Escenario 1: Autenticación Fallida y Exitosa', async ({ page }) => {
    await page.goto('/#/admin');
    
    // Esperar a que el componente de Login esté listo (getByPlaceholder es robusto)
    const userField = page.getByPlaceholder('admin_ufaal');
    await expect(userField).toBeVisible({ timeout: 20000 });

    // 1. Caso Negativo
    await userField.fill('test_bad');
    await page.getByPlaceholder('••••••••').fill('wrong_pass_123');
    await page.getByRole('button', { name: /Acceder/i }).click();
    await expect(page.locator('div.bg-red-50')).toBeVisible({ timeout: 15000 });

    // 2. Caso Positivo (admin123)
    await userField.fill('admin_ufaal');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: /Acceder/i }).click();

    // Verificación de Dashboard
    await expect(page.locator('aside')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/UFAAL Admin/i)).toBeVisible();
  });

  test('Escenario 2: Resiliencia ante Falla de API', async ({ page }) => {
    // 1. Loguearse para llegar al estado de dashboard
    await page.goto('/#/admin');
    await page.getByPlaceholder('admin_ufaal').fill('admin_ufaal');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: /Acceder/i }).click();
    await expect(page.locator('aside')).toBeVisible({ timeout: 20000 });

    // 2. Interceptar persistencia de datos con error 500
    await page.route('**/api/admin/content/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Simulation Error' }),
      });
    });

    // 3. Intentar guardar en Hero y verificar el mensaje de error en el Dashboard
    await page.getByRole('button', { name: /Inicio \(Hero\)/i }).click();
    await page.getByRole('button', { name: /Guardar/i }).click();
    
    // Nota: El dashboard muestra el error en el header (errorMsg)
    await expect(page.locator('header').getByText(/Simulation Error/i || /Error/i)).toBeVisible({ timeout: 15000 });
  });

  test('Escenario 3: Flujo de Edición CMS (Update Atómico)', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByPlaceholder('admin_ufaal').fill('admin_ufaal');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: /Acceder/i }).click();
    
    await expect(page.locator('aside')).toBeVisible({ timeout: 20000 });
    await page.getByRole('button', { name: /Inicio \(Hero\)/i }).click();

    const titleField = page.getByLabel(/Título Principal/i);
    const newTitle = `E2E PURE - ${Date.now()}`;
    await titleField.fill(newTitle);

    await page.getByRole('button', { name: /Guardar/i }).click();
    
    // El Toast usa el texto "exitosamente"
    await expect(page.getByText(/exitosamente/i)).toBeVisible({ timeout: 15000 });
  });
});
