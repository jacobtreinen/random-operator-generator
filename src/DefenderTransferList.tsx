import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { defenders } from './Operators';
import { Box, Stack, Typography } from '@mui/material';
import { useSessionStorage } from './useSessionStroage';
function not(a: readonly string[], b: readonly string[]) {
  return a.filter(value => !b.includes(value));
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.includes(value));
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

export default function DefenderTransferList() {
  const [checked, setChecked] = useSessionStorage<readonly string[]>(
    'defenderTransfer_checked',
    []
  );
  const [left, setLeft] = useSessionStorage<readonly string[]>(
    'defenderTransfer_left',
    []
  );
  const [right, setRight] = useSessionStorage<readonly string[]>(
    'defenderTransfer_right',
    defenders
  );

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly string[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const [randomPick, setRandomPick] = React.useState<string | null>(null);

  const handleRandomPick = () => {
    if (right.length === 0) {
      setRandomPick(null);
      return;
    }
    const pick = right[Math.floor(Math.random() * right.length)];
    setRandomPick(pick);
  };

  const customList = (title: React.ReactNode, items: readonly string[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 250,
          height: 400,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: string) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Stack flex={1} direction="column" spacing={4} alignItems="center">
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Grid>{customList('Choices', left)}</Grid>
        <Grid>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid>{customList('Chosen', right)}</Grid>
      </Grid>

      <Box mt={2} textAlign="center">
        <Button
          variant="contained"
          onClick={handleRandomPick}
          disabled={right.length === 0}
        >
          Generate Random Defender
        </Button>
        {randomPick && (
          <Typography mt={2} variant="h6">
            {`Your defender: ${randomPick}`}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
