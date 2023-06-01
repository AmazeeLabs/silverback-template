<?php

namespace Drupal\custom\Plugin\GraphQL\Directive;

use Drupal\Core\Plugin\PluginBase;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql_directives\DirectiveInterface;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;
use Drupal\graphql_directives\Plugin\GraphQL\Directive\ArgumentTrait;
use Drupal\node\Entity\Node;

/**
 * @Directive(
 *   id = "contentHub",
 *   description = "List content by title, with pagination."
 * )
 */
class ContentHub extends PluginBase implements DirectiveInterface {

  public function buildResolver(ResolverBuilder $builder, array $arguments): ResolverInterface {
    return $builder->callback(function ($parent, $args) {
      // TODO: Switch this to views.
      $offset = $args['pagination']['offset'];
      $limit = $args['pagination']['limit'];

      $countQuery = \Drupal::entityQuery('node');
      $countQuery->condition('type', 'page');
      $countQuery->condition('status', 1);
      if (!empty($args['query'])) {
        $countQuery->condition('title', $args['query'], 'CONTAINS');
      }
      $count = $countQuery->count()->execute();

      $query = \Drupal::entityQuery('node');
      $query->condition('type', 'page');
      $query->condition('status', 1);
      if (!empty($args['query'])) {
        $query->condition('title', $args['query'], 'CONTAINS');
      }
      $pageIds = $query->range($offset, $limit)
        ->sort('title', 'ASC')
        ->execute();
      $posts = $pageIds ? Node::loadMultiple($pageIds) : [];
      return [
        'total' => $count,
        'items' => $posts,
      ];
    });
  }

}