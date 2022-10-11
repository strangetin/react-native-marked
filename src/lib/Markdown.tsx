import React, { memo, ReactNode, useCallback, useMemo } from 'react';
import { FlatList, useColorScheme } from 'react-native';
import { marked } from 'marked';
import Parser from './Parser';
import getStyles from '../theme/styles';
import type { MarkdownProps } from './types';

const Markdown = ({
  value,
  flatListProps,
  styles: userStyles,
}: MarkdownProps) => {
  const systemTheme = useColorScheme();
  const styles = useMemo(
    () => getStyles(userStyles, systemTheme),
    [userStyles, systemTheme]
  );

  const rnElements = useMemo(() => {
    const parser = new Parser({
      styles,
    });
    const tokens = marked.lexer(value);

    return parser.parse(tokens);
  }, [value, styles]);

  const renderItem = useCallback(({ item }: { item: ReactNode }) => {
    return <>{item}</>;
  }, []);

  const keyExtractor = useCallback(
    (_: ReactNode, index: number) => index.toString(),
    []
  );

  return (
    <FlatList
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={8}
      initialNumToRender={8}
      removeClippedSubviews
      style={styles.container}
      {...flatListProps}
      data={rnElements}
      renderItem={renderItem}
    />
  );
};

export default memo(Markdown);
