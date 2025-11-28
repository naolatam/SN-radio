import { Request, Response } from 'express';
import { themeService } from '../services/theme.service';
import { CreateThemeDTO, UpdateThemeDTO } from '../types/shared.types';
import { ApiResponse } from '../types/shared.types';

export class ThemeController {
  /**
   * GET /api/themes
   * Get all themes
   */
  async getAllThemes(req: Request, res: Response): Promise<Response> {
    try {
      const themes = await themeService.getAllThemes();
      
      const response: ApiResponse = {
        success: true,
        data: themes
      };
      
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching themes:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch themes'
      };
      return res.status(500).json(response);
    }
  }

  /**
   * GET /api/themes/active
   * Get active theme
   */
  async getActiveTheme(req: Request, res: Response): Promise<Response> {
    try {
      const theme = await themeService.getActiveTheme();
      
      if (!theme) {
        const response: ApiResponse = {
          success: false,
          error: 'No active theme found'
        };
        return res.status(404).json(response);
      }
      
      const response: ApiResponse = {
        success: true,
        data: theme
      };
      
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching active theme:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch active theme'
      };
      return res.status(500).json(response);
    }
  }

  /**
   * GET /api/themes/:id
   * Get theme by ID
   */
  async getThemeById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const theme = await themeService.getThemeById(id);
      
      if (!theme) {
        const response: ApiResponse = {
          success: false,
          error: 'Theme not found'
        };
        return res.status(404).json(response);
      }
      
      const response: ApiResponse = {
        success: true,
        data: theme
      };
      
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching theme:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch theme'
      };
      return res.status(500).json(response);
    }
  }

  /**
   * POST /api/themes
   * Create new theme
   */
  async createTheme(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateThemeDTO = req.body;
      
      // Validate required fields
      if (!data.name || !data.slug || !data.primaryColor || !data.secondaryColor || !data.backgroundColor || !data.siteName) {
        const response: ApiResponse = {
          success: false,
          error: 'Missing required fields: name, slug, primaryColor, secondaryColor, backgroundColor, siteName'
        };
        return res.status(400).json(response);
      }
      
      const theme = await themeService.createTheme(data);
      
      const response: ApiResponse = {
        success: true,
        data: theme,
        message: 'Theme created successfully'
      };
      
      return res.status(201).json(response);
    } catch (error: any) {
      console.error('Error creating theme:', error);
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to create theme'
      };
      return res.status(400).json(response);
    }
  }

  /**
   * PUT /api/themes/:id
   * Update theme
   */
  async updateTheme(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: UpdateThemeDTO = req.body;
      
      const theme = await themeService.updateTheme(id, data);
      
      const response: ApiResponse = {
        success: true,
        data: theme,
        message: 'Theme updated successfully'
      };
      
      return res.status(200).json(response);
    } catch (error: any) {
      console.error('Error updating theme:', error);
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to update theme'
      };
      return res.status(400).json(response);
    }
  }

  /**
   * DELETE /api/themes/:id
   * Delete theme
   */
  async deleteTheme(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      await themeService.deleteTheme(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'Theme deleted successfully'
      };
      
      return res.status(200).json(response);
    } catch (error: any) {
      console.error('Error deleting theme:', error);
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to delete theme'
      };
      return res.status(400).json(response);
    }
  }

  /**
   * POST /api/themes/:id/activate
   * Activate theme
   */
  async activateTheme(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      const theme = await themeService.activateTheme(id);
      
      const response: ApiResponse = {
        success: true,
        data: theme,
        message: 'Theme activated successfully'
      };
      
      return res.status(200).json(response);
    } catch (error: any) {
      console.error('Error activating theme:', error);
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to activate theme'
      };
      return res.status(400).json(response);
    }
  }

  /**
   * POST /api/themes/:id/duplicate
   * Duplicate theme
   */
  async duplicateTheme(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;
      
      if (!name || !slug) {
        const response: ApiResponse = {
          success: false,
          error: 'Name and slug are required for duplication'
        };
        return res.status(400).json(response);
      }
      
      const theme = await themeService.duplicateTheme(id, name, slug);
      
      const response: ApiResponse = {
        success: true,
        data: theme,
        message: 'Theme duplicated successfully'
      };
      
      return res.status(201).json(response);
    } catch (error: any) {
      console.error('Error duplicating theme:', error);
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to duplicate theme'
      };
      return res.status(400).json(response);
    }
  }
}

export const themeController = new ThemeController();
