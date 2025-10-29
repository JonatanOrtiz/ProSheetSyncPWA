import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem
} from '@mui/material';
import { Restaurant, LocalFireDepartment } from '@mui/icons-material';
import { parseMealPlanData } from '@/utils/parsers';
import { SheetData } from '@/types';

interface MealPlanRendererProps {
  spreadsheets: SheetData[];
}

const getMealIcon = (mealName: string): string => {
  const name = mealName.toLowerCase();
  if (name.includes('café') || name.includes('cafe')) return '☕';
  if (name.includes('almoço') || name.includes('almoco')) return '🍽️';
  if (name.includes('jantar')) return '🌙';
  if (name.includes('lanche')) return '🍎';
  if (name.includes('ceia')) return '🌟';
  return '🍴';
};

const getMealColor = (mealName: string): string => {
  const name = mealName.toLowerCase();
  if (name.includes('café') || name.includes('cafe')) return '#fb6340';
  if (name.includes('almoço') || name.includes('almoco')) return '#2dce89';
  if (name.includes('jantar')) return '#5e72e4';
  if (name.includes('lanche')) return '#11cdef';
  return '#8898aa';
};

export const MealPlanRenderer: React.FC<MealPlanRendererProps> = ({ spreadsheets }) => {
  if (!spreadsheets || spreadsheets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Nenhum plano alimentar disponível</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {spreadsheets.map((sheet) => {
        const meals = parseMealPlanData(sheet.data);

        return (
          <Box key={sheet.sheetId}>
            {/* Sheet title */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <Restaurant sx={{ mr: 1, color: '#2dce89' }} />
              {sheet.sheetTitle}
            </Typography>

            {/* Meals */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {meals.map((meal, mealIndex) => {
                const totalCalories = meal.foods.reduce((sum, food) => sum + (food.calories || 0), 0);

                return (
                  <Card
                    key={mealIndex}
                    sx={{
                      borderLeft: `4px solid ${getMealColor(meal.mealName)}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <CardContent>
                      {/* Meal header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${getMealColor(meal.mealName)}20`,
                            color: getMealColor(meal.mealName),
                            width: 48,
                            height: 48,
                            mr: 2,
                            fontSize: 24
                          }}
                        >
                          {getMealIcon(meal.mealName)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {meal.mealName}
                          </Typography>
                          {meal.time && (
                            <Typography variant="body2" color="text.secondary">
                              {meal.time}
                            </Typography>
                          )}
                        </Box>
                        {totalCalories > 0 && (
                          <Chip
                            icon={<LocalFireDepartment sx={{ fontSize: 18 }} />}
                            label={`${totalCalories} kcal`}
                            sx={{
                              bgcolor: `${getMealColor(meal.mealName)}20`,
                              color: getMealColor(meal.mealName),
                              fontWeight: 600
                            }}
                          />
                        )}
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Food items */}
                      <List sx={{ py: 0 }}>
                        {meal.foods.map((food, foodIndex) => (
                          <ListItem
                            key={foodIndex}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              py: 1.5,
                              px: 0
                            }}
                          >
                            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {food.name}
                              </Typography>
                              {food.quantity && (
                                <Typography variant="body2" color="text.secondary">
                                  {food.quantity}
                                </Typography>
                              )}
                            </Box>

                            {/* Macros */}
                            {(food.calories || food.protein || food.carbs || food.fat) && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {food.calories && (
                                  <Chip
                                    label={`${food.calories} kcal`}
                                    size="small"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                )}
                                {food.protein && (
                                  <Chip
                                    label={`Prot: ${food.protein}`}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.7rem',
                                      bgcolor: '#2dce8920',
                                      color: '#2dce89'
                                    }}
                                  />
                                )}
                                {food.carbs && (
                                  <Chip
                                    label={`Carb: ${food.carbs}`}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.7rem',
                                      bgcolor: '#11cdef20',
                                      color: '#11cdef'
                                    }}
                                  />
                                )}
                                {food.fat && (
                                  <Chip
                                    label={`Gord: ${food.fat}`}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.7rem',
                                      bgcolor: '#fb634020',
                                      color: '#fb6340'
                                    }}
                                  />
                                )}
                              </Box>
                            )}
                          </ListItem>
                        ))}
                      </List>
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
