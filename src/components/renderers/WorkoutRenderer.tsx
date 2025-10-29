import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Checkbox,
  Avatar,
  Divider
} from '@mui/material';
import { ExpandMore, FitnessCenter, Timer, Repeat } from '@mui/icons-material';
import { parseWorkoutData } from '@/utils/parsers';
import { SheetData } from '@/types';

interface WorkoutRendererProps {
  spreadsheets: SheetData[];
}

export const WorkoutRenderer: React.FC<WorkoutRendererProps> = ({ spreadsheets }) => {
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  if (!spreadsheets || spreadsheets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Nenhum treino disponível</Typography>
      </Box>
    );
  }

  const handleToggleExercise = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {spreadsheets.map((sheet, sheetIndex) => {
        const workoutDays = parseWorkoutData(sheet.data);

        return (
          <Box key={sheet.sheetId}>
            {/* Sheet title */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <FitnessCenter sx={{ mr: 1, color: '#f5365c' }} />
              {sheet.sheetTitle}
            </Typography>

            {/* Workout days */}
            {workoutDays.map((day, dayIndex) => (
              <Accordion
                key={`${sheetIndex}-${dayIndex}`}
                defaultExpanded={dayIndex === 0}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Avatar
                      sx={{
                        bgcolor: '#f5365c',
                        width: 40,
                        height: 40,
                        mr: 2
                      }}
                    >
                      {day.dayName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {day.dayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {day.exercises.length} exercícios
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <List sx={{ py: 0 }}>
                    {day.exercises.map((exercise, exerciseIndex) => {
                      const exerciseId = `${sheetIndex}-${dayIndex}-${exerciseIndex}`;
                      const isCompleted = completedExercises.has(exerciseId);

                      return (
                        <React.Fragment key={exerciseIndex}>
                          <ListItem
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              py: 2,
                              bgcolor: isCompleted ? 'action.hover' : 'transparent',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                              <Checkbox
                                checked={isCompleted}
                                onChange={() => handleToggleExercise(exerciseId)}
                                sx={{ mt: -1 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 600,
                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                    color: isCompleted ? 'text.secondary' : 'text.primary'
                                  }}
                                >
                                  {exercise.name}
                                </Typography>

                                {/* Exercise details chips */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                  {exercise.sets && (
                                    <Chip
                                      icon={<Repeat sx={{ fontSize: 16 }} />}
                                      label={`${exercise.sets} séries`}
                                      size="small"
                                      sx={{ bgcolor: 'primary.lighter' }}
                                    />
                                  )}
                                  {exercise.reps && (
                                    <Chip
                                      label={`${exercise.reps} reps`}
                                      size="small"
                                      sx={{ bgcolor: 'secondary.lighter' }}
                                    />
                                  )}
                                  {exercise.rest && (
                                    <Chip
                                      icon={<Timer sx={{ fontSize: 16 }} />}
                                      label={exercise.rest}
                                      size="small"
                                      sx={{ bgcolor: 'info.lighter' }}
                                    />
                                  )}
                                  {exercise.weight && (
                                    <Chip
                                      label={exercise.weight}
                                      size="small"
                                      sx={{ bgcolor: 'warning.lighter' }}
                                    />
                                  )}
                                </Box>

                                {/* Notes */}
                                {exercise.notes && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1, fontStyle: 'italic' }}
                                  >
                                    {exercise.notes}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </ListItem>
                          {exerciseIndex < day.exercises.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
