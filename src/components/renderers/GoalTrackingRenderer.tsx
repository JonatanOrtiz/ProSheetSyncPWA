import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar
} from '@mui/material';
import { TrackChanges, Flag, TrendingUp, CalendarToday } from '@mui/icons-material';
import { parseGoalData } from '@/utils/parsers';
import { SheetData } from '@/types';

interface GoalTrackingRendererProps {
  spreadsheets: SheetData[];
}

const getProgressColor = (progress: number): string => {
  if (progress >= 100) return '#2dce89';
  if (progress >= 75) return '#11cdef';
  if (progress >= 50) return '#fb6340';
  return '#f5365c';
};

const getProgressLabel = (progress: number): string => {
  if (progress >= 100) return 'Concluído';
  if (progress >= 75) return 'Quase lá';
  if (progress >= 50) return 'No caminho';
  if (progress >= 25) return 'Iniciando';
  return 'Começar';
};

export const GoalTrackingRenderer: React.FC<GoalTrackingRendererProps> = ({ spreadsheets }) => {
  if (!spreadsheets || spreadsheets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Nenhuma meta disponível</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {spreadsheets.map((sheet) => {
        const goals = parseGoalData(sheet.data);

        return (
          <Box key={sheet.sheetId}>
            {/* Sheet title */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <TrackChanges sx={{ mr: 1, color: '#11cdef' }} />
              {sheet.sheetTitle}
            </Typography>

            {/* Goals */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {goals.map((goal, goalIndex) => {
                const progress = goal.progress || 0;
                const progressColor = getProgressColor(progress);

                return (
                  <Card
                    key={goalIndex}
                    sx={{
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderTop: `3px solid ${progressColor}`
                    }}
                  >
                    <CardContent>
                      {/* Goal header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${progressColor}20`,
                            color: progressColor,
                            width: 48,
                            height: 48,
                            mr: 2
                          }}
                        >
                          <Flag />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {goal.goalName}
                          </Typography>
                          {goal.description && (
                            <Typography variant="body2" color="text.secondary">
                              {goal.description}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={getProgressLabel(progress)}
                          size="small"
                          sx={{
                            bgcolor: `${progressColor}20`,
                            color: progressColor,
                            fontWeight: 600
                          }}
                        />
                      </Box>

                      {/* Progress bar */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progresso
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: progressColor }}>
                            {progress.toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: `${progressColor}20`,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: progressColor,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>

                      {/* Goal details */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {goal.current && goal.target && (
                          <Box sx={{ flex: 1, minWidth: '45%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                Atual / Meta
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {goal.current} / {goal.target}
                            </Typography>
                          </Box>
                        )}

                        {goal.deadline && (
                          <Box sx={{ flex: 1, minWidth: '45%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                Prazo
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {goal.deadline}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
