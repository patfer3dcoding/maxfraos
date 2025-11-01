import type { AppConfig } from './types';
import * as Icons from './components/icons';
import { 
    NotepadApp, 
    FileExplorerApp, 
    SettingsApp, 
    CalculatorApp, 
    MaxfraAiBrowserApp, 
    CalendarApp, 
    ClipCalculatorApp,
    MaxfraOfficeSuiteApp,
    StudentDatabaseApp,
    CheckInApp,
    MaxfraLibraryApp,
    ImageViewerApp
} from './apps/index';

// MAXFRA Logo Base64 - PNG with transparent background
export const MAXFRA_LOGO_B64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsAAAA7ABJht5qgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAXfSURBVPic7Z1viFxVTMd/584666xiIkjQoJ8yCF6UgmChwUuCYpGgoBU82SiEnwhilza0wYc2JVkFqUWLp1pL86C4qRBET4JQtSgj0IIHwYt2C0H4A/GTrNSVqJnRNM/u+2bO3Xfnzsy5d86cO++5M/Of/jJ37j1n5jtz5sw5MxqwJp3AJqB1gH5AswNfAd/gc5CpxA18G7CbxHwDXAD2BBYCaxK5aFnxH3An8APQCfQDbSg/PqfA/cCTgZuBdwGXxHXxLTAamAjsBL6qH+AWYElG/dG+gO3AHcB6YAa5GcCbXyL+C/AH0AVsB9YDxwO/xH1fAKeBLSk0/L8R2Blg/2+BpwJjkhk2fA18BvQCtQB/BRYA9wNDaPQftQTgZmAeMAA4DLgYmJLI1qV/wF3AD8ADwGbgiwS+wG3AfcB1wDPAeGCSQK0vAW8CfwL9wFfAGcCgwDEJXCfM3AW8BPwJ7Ac2AWcB44FxJDB8+AngV+D/R+B94GpgjAxGbwDeBn4BLgG2A/OBccAYGQy/A7gR+GcC/wbcCYyZwPD7gB+B3xTwB4C/m0QkMHy/gZ8J/F7gl4A/gB+ZwPB/gV8T+L/ATwN/A+NmMPx/YPgE/gK8L5Xg7QZ8JfB7gR8G/gC+ZwzDR5uBnwH8VODHAr8I/GaMwdcF/gzwY4EfhN8P/GEYg4+zge+A/xTwI4Bfg98L/GqMwecZwU+B/xTwI4Bfg98L/GEYg4+zge+A/xTwI4Bfg98L/GqMwecZwU+B/xTwI4Bfg98L/GEYg4+zge+A/xTwI4Bfg98L/GqMwecZwU+B/xTwI4Bfg98L/GEYg4+zge+A/xTwI4Bfg98L/GqMwecZwU+B/xTwI4Bfg98L/GEYg4