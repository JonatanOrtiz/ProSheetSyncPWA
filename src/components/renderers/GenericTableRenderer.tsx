import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore, TableChart } from '@mui/icons-material';
import { SheetData } from '@/types';

interface GenericTableRendererProps {
  spreadsheets: SheetData[];
}

export const GenericTableRenderer: React.FC<GenericTableRendererProps> = ({ spreadsheets }) => {
  if (!spreadsheets || spreadsheets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Nenhum dado disponível</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {spreadsheets.map((sheet, sheetIndex) => {
        if (!sheet.data || sheet.data.length === 0) {
          return (
            <Box key={sheet.sheetId} sx={{ textAlign: 'center', py: 2 }}>
              <Typography color="text.secondary">
                Nenhum dado disponível em {sheet.sheetTitle}
              </Typography>
            </Box>
          );
        }

        const headers = sheet.data[0] || [];
        const rows = sheet.data.slice(1);

        return (
          <Accordion
            key={sheet.sheetId}
            defaultExpanded={sheetIndex === 0}
            sx={{
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TableChart sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {sheet.sheetTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rows.length} linhas
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small" sx={{ minWidth: 300 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      {headers.map((header: any, index: number) => (
                        <TableCell
                          key={index}
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            borderBottom: 2,
                            borderColor: 'divider'
                          }}
                        >
                          {String(header || `Coluna ${index + 1}`)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row: any[], rowIndex: number) => (
                      <TableRow
                        key={rowIndex}
                        sx={{
                          '&:nth-of-type(odd)': {
                            bgcolor: 'action.hover'
                          },
                          '&:hover': {
                            bgcolor: 'action.selected'
                          }
                        }}
                      >
                        {headers.map((_: any, cellIndex: number) => (
                          <TableCell
                            key={cellIndex}
                            sx={{
                              whiteSpace: 'nowrap',
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {String(row[cellIndex] || '-')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Sheet info */}
              <Box sx={{ p: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {rows.length} linhas • {headers.length} colunas
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
